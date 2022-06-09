import { isAddress } from "@ethersproject/address";
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Redis } from "@upstash/redis";
import { omit } from "lodash-es";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

export default async function MirrorApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (typeof req.query.address !== "string" || !isAddress(req.query.address)) {
    res.status(400).send("not address");
    return;
  }
  const key = `mirror:${Buffer.from(
    req.query.address.replace("0x", ""),
    "hex"
  ).toString("base64")}`;
  try {
    const cached = await redis.get(key);
    if (cached) {
      res.setHeader(
        "cache-control",
        `public, max-age=${MONTH_IN_SECONDS}, immutable`
      );
      res.json(cached);
      return;
    }
    const response = await fetch("https://mirror-api.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://mirror.xyz",
      },
      body: JSON.stringify({
        operationName: "ProjectFeed",
        variables: {
          projectAddress: req.query.address,
        },
        query:
          "query ProjectFeed($projectAddress: String!) {\n  projectFeed(projectAddress: $projectAddress) {\n    ...projectDetails\n    posts {\n      ... on crowdfund {\n        ...crowdfundDetails\n        publisher {\n          ...publisherDetails\n          __typename\n        }\n        __typename\n      }\n      ... on entry {\n        ...entryDetails\n        publisher {\n          ...publisherDetails\n          __typename\n        }\n        collaborators {\n          ...projectDetails\n          __typename\n        }\n        editions {\n          ...entryEdition\n          __typename\n        }\n        writingNFT {\n          _id\n          proxyAddress\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment projectDetails on ProjectType {\n  _id\n  address\n  avatarURL\n  description\n  displayName\n  domain\n  ens\n  gaTrackingID\n  mailingListURL\n  headerImage {\n    ...mediaAsset\n    __typename\n  }\n  theme {\n    ...themeDetails\n    __typename\n  }\n  __typename\n}\n\nfragment mediaAsset on MediaAssetType {\n  id\n  cid\n  mimetype\n  sizes {\n    ...mediaAssetSizes\n    __typename\n  }\n  url\n  __typename\n}\n\nfragment mediaAssetSizes on MediaAssetSizesType {\n  og {\n    ...mediaAssetSize\n    __typename\n  }\n  lg {\n    ...mediaAssetSize\n    __typename\n  }\n  md {\n    ...mediaAssetSize\n    __typename\n  }\n  sm {\n    ...mediaAssetSize\n    __typename\n  }\n  __typename\n}\n\nfragment mediaAssetSize on MediaAssetSizeType {\n  src\n  height\n  width\n  __typename\n}\n\nfragment themeDetails on UserProfileThemeType {\n  accent\n  colorMode\n  __typename\n}\n\nfragment crowdfundDetails on crowdfund {\n  _id\n  address\n  content\n  contributionLimit\n  contributorAddress\n  createdAt\n  crowdfundDraftId\n  endsAt\n  fundingRecipient\n  goal\n  id\n  name\n  network\n  publishStatus\n  stretchGoal\n  symbol\n  title\n  transactionHash\n  version\n  metadata {\n    coverImage {\n      ...mediaAsset\n      __typename\n    }\n    podium {\n      first {\n        ...podiumField\n        __typename\n      }\n      second {\n        ...podiumField\n        __typename\n      }\n      third {\n        ...podiumField\n        __typename\n      }\n      duration\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment podiumField on PodiumFieldType {\n  title\n  description\n  primaryMedia {\n    ...mediaAsset\n    __typename\n  }\n  thumbnailMedia {\n    ...mediaAsset\n    __typename\n  }\n  __typename\n}\n\nfragment publisherDetails on PublisherType {\n  project {\n    ...projectDetails\n    __typename\n  }\n  member {\n    ...projectDetails\n    __typename\n  }\n  __typename\n}\n\nfragment entryDetails on entry {\n  _id\n  body\n  hideTitleInEntry\n  publishStatus\n  publishedAtTimestamp\n  originalDigest\n  timestamp\n  title\n  arweaveTransactionRequest {\n    transactionId\n    __typename\n  }\n  featuredImageId\n  featuredImage {\n    mimetype\n    url\n    __typename\n  }\n  publisher {\n    ...publisherDetails\n    __typename\n  }\n  latestBlockData {\n    timestamp\n    number\n    __typename\n  }\n  __typename\n}\n\nfragment entryEdition on edition {\n  _id\n  title\n  price\n  quantity\n  description\n  editionId\n  mediaURL\n  editionContractAddress\n  fundingRecipient\n  events {\n    event\n    transactionHash\n    numSold\n    avatarURL\n    twitterUsername\n    serialNumber\n    collectorAddress\n    amountPaid\n    blockNumber\n    __typename\n  }\n  attributes {\n    trait_type\n    value\n    __typename\n  }\n  primaryMedia {\n    mimetype\n    sizes {\n      og {\n        ...mediaAssetSize\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  thumbnailMedia {\n    mimetype\n    sizes {\n      og {\n        ...mediaAssetSize\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n",
      }),
    });
    const json = (await response.json()) as {
      data?: {
        projectFeed?: {
          avatarURL: string;
          displayName: string;
          description?: string;
          domain?: string;
        };
      };
    };
    if (!json.data?.projectFeed) {
      res.setHeader(
        "cache-control",
        `public, max-age=${MONTH_IN_SECONDS}, immutable`
      );
      res.json(null);
      return;
    }
    const data = omit(json.data.projectFeed, ["posts", "theme"]);
    await redis.set(key, JSON.stringify(data), {
      ex: MONTH_IN_SECONDS,
    });
    res.setHeader(
      "cache-control",
      `public, max-age=${MONTH_IN_SECONDS}, immutable`
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("parse error");
  }
}

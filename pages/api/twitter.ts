import { isAddress } from "@ethersproject/address";
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

export default async function TwitterApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (typeof req.query.address !== "string" || !isAddress(req.query.address)) {
    res.status(400).send("not address");
    return;
  }
  const key = `twitter:${Buffer.from(
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
    const response = await fetch(
      `https://etherscan.io/token/${req.query.address}`
    );
    const text = await response.text();
    const twitter = text.match(
      /original-title='Twitter: https:\/\/www\.twitter\.com\/([^']+)'/
    )?.[1];
    if (twitter) {
      await redis.set(key, twitter, { ex: MONTH_IN_SECONDS });
      res.setHeader(
        "cache-control",
        `public, max-age=${MONTH_IN_SECONDS}, immutable`
      );
      res.json(twitter);
      return;
    }
    if (typeof req.query.slug === "string") {
      const response2 = await fetch(
        `http://47.56.71.87:18081/os/collection/${req.query.slug}?apikey=b894b8ea76e5a03c558dc5d1`
      );
      const text2 = await response2.text();
      const twitter2 =
        text2.match(/"connectedTwitterUsername":"([^"]+)"/)?.[1] ||
        text2
          .replaceAll("https://twitter.com/opensea", "")
          .match(/https:\/\/twitter\.com\/(\w+)/)?.[1];
      if (twitter2) {
        await redis.set(key, twitter2, { ex: MONTH_IN_SECONDS });
        res.setHeader(
          "cache-control",
          `public, max-age=${MONTH_IN_SECONDS}, immutable`
        );
        res.json(twitter2);
        return;
      }
    }
    res.json(null);
  } catch {
    res.status(500).send("parse error");
  }
}

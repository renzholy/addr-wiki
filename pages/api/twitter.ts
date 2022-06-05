import { isAddress } from "ethers/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function TwitterApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (typeof req.query.address !== "string" || !isAddress(req.query.address)) {
    res.status(400).send("not address");
    return;
  }
  try {
    const response = await fetch(
      `https://etherscan.io/token/${req.query.address}`
    );
    const text = await response.text();
    res.setHeader("cache-control", "public, max-age=43200, immutable");
    const twitter = text.match(
      /original-title='Twitter: https:\/\/www\.twitter\.com\/([^']+)'/
    )?.[1];
    if (twitter) {
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
        res.json(twitter2);
        return;
      }
    }
    res.json(null);
  } catch {
    res.status(500).send("parse error");
  }
}

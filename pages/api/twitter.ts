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
    res.json(
      text.match(
        /original-title='Twitter: https:\/\/www\.twitter\.com\/([^']+)'/
      )?.[1]
    );
  } catch {
    res.status(500).send("parse error");
  }
}

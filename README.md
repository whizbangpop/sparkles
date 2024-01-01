sparkles! ✨ - The Penultimate Roleplay Backup Bot

(C) Abigail Henderson & contributors 2024

## Why?
Because when a friend of mine nearly deleted an entire roleplay, I wanted to make sure that no more were ever lost again. So, I started a line of bots - of which sparkles! is the latest and greatest.

## How does Premium work?
### Per Message Rate
Simple. You get up 1,000 messages stored free (across up to 3 roleplays) after which you pay per 1,000 messages stored.

### Subscription Rate
Even more simple. Pay a flat fee every month. Unlimited message storage.\n
Even if you stop paying, sparkles! will continue to store any existing messages, it just won't log new ones.
*The subscription is better value than the per-message rate, and it allows me to continue hosting and storing messages and metadata.*

Pricing still to be determined. All payment processing is handled through Stripe.

Message recovery will always be free, even if you have no message credits left or stopped your subscription.

## How does sparkles! keep your messages safe?
When a message is logged by sparkles!, it is synced to at least 2 databases in different continents, to make sure tht unless global warfare starts, or something like that, your messages are safely stored.

### Protecting your privacy.
I personally take privacy incredibly seriously - and that extends to anything that sparkles! logs. That's why all message are encrypted with an RSA256 key based off a salted version of the security key you set when setting the bot up.

For additional piece of mind, you can use your own encryption keys. Open a ticket or DM me with your public key (please give me an RSA256 public key).

> [!CAUTION]
> Please keep your security phrase and/or encryption keys safe! If you loose them, I **CANNOT** recover the keys or your messages. Like by the laws of mathematics I cannot.

## Privacy Policy & Terms of Service

Please make sure to read these. Adding the bot is *not* agreeing to this, but you will be asked during setup to agree.

Make sure to send server members the specified section before accepting. Be a decent person.

### Privacy Policy
To provide sparkles!, a small amount of data has to be collected to allow sparkles! to function. This includes:
* Your server ID
  * This is a long number that Discord uses to identify your Discord server
  * We use this to keep track of where messages are sent, and who they belong to
* All connected channel IDs
  * These are similar to server IDs, but for individual channels
  * We use these to know where to recover messages to
  * sparkles! will automatically discard messages from channels it has not been granted access to
* Your user ID
  * This is a long number that Discord uses to identify your user account when using Discord
  * We use this number to make sure we know who is talking, and what messages you have purchased.
* Your messages (encrypted at rest)
* Transaction ID's connected to your user ID
  * This is **NOT** your payment information. I never even get to see it. All payment info is handled by Stripe.

We aim to store as little information as possible. To make sure your data is not lying about exposed for a long period of time unused, we will delete data if not used or touched in two years. We will contact you if you have not used sparkles! in 18 months to confirm if you would like us to continue holding onto this data.

If we do not receive a response, we will get back in touch 30 days before 2 years of no usage. To comply with our police, if we do not receive a response again, we will start data deletion 30 days after the notice. At this point, you data cannot be recovered.

Any questions or concerns can be sent to [data.protection@sparklesbot.cc](mailto:data.protection@sparklesbot.cc) or through the Discord support server.

### Server Admin ToS
By adding sparkles! to your Discord server, and subsequently agreeing to these terms, you agree to the following:
* We reserve the right to revoke access to sparkle! following detection or abuse of the system

# Tech Specs

Because it's fun, here's a rundown of the tech that we use to make sparkles! work. And no, we're not leaking sensitive
data - sparkles! is open source. We use the same code you see, bar the subscription system as we keep that private for
what should be obvious reasons.

## Core Libraries & Attributions

To power the Discord bot, we use the infamous **discord.js** library. Even with a lot of it's heftieness, it's an
incredibly powerful tool, and allows many of the features found to work.

Some code found within sprakles! is licenced from my other project TSAB, which is released under the AGPL 2.0 license.
Certain restrictions may apply.

## Database(s)

| Database | Info & Fun Facts                                                                                                                                                              |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Redis    | We use Redis as an ingest database because of the fact it stores data in RAM, rather than hard disk. This was also the first database that was fully implemented in sparkles! |
| MongoDB  | MongoDB is used to store user & guild data, as well as things like encryption keys and preferences.                                                                           |
| MySQL    | MySQL was chosen as a lightweight, but relativley powerful database, capable of storing all of the messages that sparkles! stores.                                            |

## Encrpytion

For full transparency, all messages stored using our keys use the following key:

```bash

```

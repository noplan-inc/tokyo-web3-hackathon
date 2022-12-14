## 動作確認


```bash
# host terminal
$ docker compose run -d --rm --name alice lnd_alice 
[+] Running 1/0
 ⠿ Container btcd  Running                                                                                                                                                                                                                                                                                                                                                 0.0s
docker_lnd_alice_run_13140f09ab08

$ docker exec -it alice bash

# alice terminal
bash-5.1#  lncli --network=simnet newaddress np2wkh
{
    "address": "rgtRCmcNPZmQJxhBphBvb5kG7MEr4rAtfD"
}


# host terminal
sudo MINING_ADDRESS=rgtRCmcNPZmQJxhBphBvb5kG7MEr4rAtfD docker compose up -d btcd


sudo docker exec -it btcd /start-btcctl.sh generate 400


# alice terminal
$ lncli --network=simnet walletbalance


# host terminal
sudo docker compose run -d --rm --name bob --service-ports lnd_bob 

docker exec -it bob bash

# bob terminal
bash-5.1# lncli --network=simnet getinfo |grep identity
    "identity_pubkey": "03f61ce6b7ee68c720428a82ad0b309517d05edf5352946824bbf2a3df39917eef",
    
    
# host terminal
$ sudo docker inspect bob | grep IPAddress
            "SecondaryIPAddresses": null,
            "IPAddress": "",
                    "IPAddress": "172.19.0.4",

# alice terminal
$ lncli --network=simnet connect 03f61ce6b7ee68c720428a82ad0b309517d05edf5352946824bbf2a3df39917eef@172.20.0.4

$ lncli --network=simnet openchannel --node_key=03f61ce6b7ee68c720428a82ad0b309517d05edf5352946824bbf2a3df39917eef --local_amt=1000000


# host terminal 
$ sudo MINING_ADDRESS=roWTHF1CNdWRDVZREWaaHfRDBQhM4uP8iH docker compose up -d btcd
$ sudo docker exec -it btcd /start-btcctl.sh generate 400


# bob terminal
bash-5.1# lncli --network=simnet addinvoice --amt=10000
{
    "r_hash": "f1a1e5164c5a2ec66c71be20bbb0acaff95aa24bfca74d45b463839aaf1e7b2a",
    "payment_request": "lnsb100u1p34ug5gpp5y94xmt42qk2lguflclqa8kg7rr8zdw7zzv2xp8qaeh4h9pch952qdqqcqzpgxqyz5vqsp50wad7x8jpn4w99cy0ap7vuld7xj3mfv4quslwmke6medzqf8uexs9qyyssqwgku946lwr9a53863h5dysl9r2l78p0en854a0ppfr2zw4j3ev6nzddh59w3le0va4vak404v48v4a0ve9jwph5dfe79eadqhzauz5sqqfylgw",
    "add_index": "1",
    "payment_addr": "9f1e13f850f01ed44536a1cbbb36c8675c080069d2376d05203e30cd71422d5f"
}


# alice terminal
lncli --network=simnet payinvoice --pay_req=lnsb100u1p3k0qvlpp5lngmqtx5cs0666umtg35w3gzly6lxczdfeh0jeehng6a33uwnsjqdqqcqzpgxqyz5vqsp5zncumthvey6lnj0gtl6wu7fqs8cdjayj86frqslwjefamlkmtmfs9qyyssqlrruy0rm06876jfv0vnn7dsfzlcdh4daezzzwfl74r3na4rw7rqzhupw3z6m4kqm74f4n4mag96su53efz47yfghgmfmncgqgrztqlgp3sfg4m
Payment hash: f1a1e5164c5a2ec66c71be20bbb0acaff95aa24bfca74d45b463839aaf1e7b2a



# host terminal
sudo docker compose up -d aperture etcd nginx







# down command
docker compose down aperture etcd nginx


```

















This document is written for people who are eager to do something with 
the Lightning Network Daemon (`lnd`). This folder uses `docker-compose` to
package `lnd` and `btcd` together to make deploying the two daemons as easy as
typing a few commands. All configuration between `lnd` and `btcd` are handled
automatically by their `docker-compose` config file.

### Prerequisites
Name  | Version 
--------|---------
docker-compose | 1.9.0
docker | 1.13.0
  
### Table of content
 * [Create lightning network cluster](#create-lightning-network-cluster)
 * [Connect to faucet lightning node](#connect-to-faucet-lightning-node)
 * [Questions](#questions)

### Create lightning network cluster
This section describes a workflow on `simnet`, a development/test network
that's similar to Bitcoin Core's `regtest` mode. In `simnet` mode blocks can be
generated at will, as the difficulty is very low. This makes it an ideal
environment for testing as one doesn't need to wait tens of minutes for blocks
to arrive in order to test channel related functionality. Additionally, it's
possible to spin up an arbitrary number of `lnd` instances within containers to
create a mini development cluster. All state is saved between instances using a
shared volume.

Current workflow is big because we recreate the whole network by ourselves,
next versions will use the started `btcd` bitcoin node in `testnet` and
`faucet` wallet from which you will get the bitcoins.

In the workflow below, we describe the steps required to recreate the following
topology, and send a payment from `Alice` to `Bob`.
```text
+ ----- +                   + --- +
| Alice | <--- channel ---> | Bob |  <---   Bob and Alice are the lightning network daemons which 
+ ----- +                   + --- +         create channels and interact with each other using the   
    |                          |            Bitcoin network as source of truth. 
    |                          |            
    + - - - -  - + - - - - - - +            
                 |
        + --------------- +
        | Bitcoin network |  <---  In the current scenario for simplicity we create only one  
        + --------------- +        "btcd" node which represents the Bitcoin network, in a 
                                    real situation Alice and Bob will likely be 
                                    connected to different Bitcoin nodes.
```

**General workflow is the following:** 

 * Create a `btcd` node running on a private `simnet`.
 * Create `Alice`, one of the `lnd` nodes in our simulation network.
 * Create `Bob`, the other `lnd` node in our simulation network.
 * Mine some blocks to send `Alice` some bitcoins.
 * Open channel between `Alice` and `Bob`.
 * Send payment from `Alice` to `Bob`.
 * Close the channel between `Alice` and `Bob`.
 * Check that on-chain `Bob` balance was changed.

Start `btcd`, and then create an address for `Alice` that we'll directly mine
bitcoin into.
```shell
$ docker compose up web aperture lnd_bob lnd_alice etcd

# Init bitcoin network env variable:
⛰  export NETWORK="simnet" 

# Create persistent volumes for alice and bob.
⛰  docker volume create simnet_lnd_alice
⛰  docker volume create simnet_lnd_bob

# Run the "Alice" container and log into it:
⛰  docker-compose run -d --name alice --volume simnet_lnd_alice:/root/.lnd lnd
⛰  docker exec -i -t alice bash

# Generate a new backward compatible nested p2sh address for Alice:
alice ⛰  lncli --network=simnet newaddress np2wkh 

# Recreate "btcd" node and set Alice's address as mining address:
⛰  MINING_ADDRESS=<alice_address> docker-compose up -d btcd

# Generate 400 blocks (we need at least "100 >=" blocks because of coinbase 
# block maturity and "300 ~=" in order to activate segwit):
⛰  docker exec -it btcd /start-btcctl.sh generate 400

# Check that segwit is active:
⛰  docker exec -it btcd /start-btcctl.sh getblockchaininfo | grep -A 1 segwit
```

Check `Alice` balance:
```shell
alice ⛰  lncli --network=simnet walletbalance
```

Connect `Bob` node to `Alice` node.

```shell
# Run "Bob" node and log into it:
⛰  docker-compose run -d --name bob --volume simnet_lnd_bob:/root/.lnd lnd
⛰  docker exec -i -t bob bash

# Get the identity pubkey of "Bob" node:
bob ⛰  lncli --network=simnet getinfo
{
    ----->"identity_pubkey": "0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38",
    "alias": "",
    "num_pending_channels": 0,
    "num_active_channels": 0,
    "num_inactive_channels": 0,
    "num_peers": 0,
    "block_height": 1215,
    "block_hash": "7d0bc86ea4151ed3b5be908ea883d2ac3073263537bcf8ca2dca4bec22e79d50",
    "synced_to_chain": true,
    "testnet": false
    "chains": [
        "bitcoin"
    ]
}

# Get the IP address of "Bob" node:
⛰  docker inspect bob | grep IPAddress

# Connect "Alice" to the "Bob" node:
alice ⛰  lncli --network=simnet connect <bob_pubkey>@<bob_host>

# Check list of peers on "Alice" side:
alice ⛰  lncli --network=simnet listpeers
{
    "peers": [
        {
            "pub_key": "0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38",
            "address": "172.19.0.4:9735",
            "bytes_sent": "357",
            "bytes_recv": "357",
            "sat_sent": "0",
            "sat_recv": "0",
            "inbound": true,
            "ping_time": "0"
        }
    ]
}

# Check list of peers on "Bob" side:
bob ⛰  lncli --network=simnet listpeers
{
    "peers": [
        {
            "pub_key": "03d0cd35b761f789983f3cfe82c68170cd1c3266b39220c24f7dd72ef4be0883eb",
            "address": "172.19.0.3:51932",
            "bytes_sent": "357",
            "bytes_recv": "357",
            "sat_sent": "0",
            "sat_recv": "0",
            "inbound": false,
            "ping_time": "0"
        }
    ]
}
```

Create the `Alice<->Bob` channel.
```shell
# Open the channel with "Bob":
alice ⛰  lncli --network=simnet openchannel --node_key=<bob_identity_pubkey> --local_amt=1000000

# Include funding transaction in block thereby opening the channel:
⛰  docker exec -it btcd /start-btcctl.sh generate 3

# Check that channel with "Bob" was opened:
alice ⛰  lncli --network=simnet listchannels
{
    "channels": [
        {
            "active": true,
            "remote_pubkey": "0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38",
            "channel_point": "3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275:0",
            "chan_id": "1337006139441152",
            "capacity": "1005000",
            "local_balance": "1000000",
            "remote_balance": "0",
            "commit_fee": "8688",
            "commit_weight": "600",
            "fee_per_kw": "12000",
            "unsettled_balance": "0",
            "total_satoshis_sent": "0",
            "total_satoshis_received": "0",
            "num_updates": "0",
             "pending_htlcs": [
            ],
            "csv_delay": 4
        }
    ]
}
```

Send the payment from `Alice` to `Bob`.
```shell
# Add invoice on "Bob" side:
bob ⛰  lncli --network=simnet addinvoice --amt=10000
{
        "r_hash": "<your_random_rhash_here>", 
        "pay_req": "<encoded_invoice>", 
}

# Send payment from "Alice" to "Bob":
alice ⛰  lncli --network=simnet sendpayment --pay_req=<encoded_invoice>

# Check "Alice"'s channel balance
alice ⛰  lncli --network=simnet channelbalance

# Check "Bob"'s channel balance
bob ⛰  lncli --network=simnet channelbalance
```

Now we have open channel in which we sent only one payment, let's imagine
that we sent lots of them and we'd now like to close the channel. Let's do
it!
```shell
# List the "Alice" channel and retrieve "channel_point" which represents
# the opened channel:
alice ⛰  lncli --network=simnet listchannels
{
    "channels": [
        {
            "active": true,
            "remote_pubkey": "0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38",
       ---->"channel_point": "3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275:0",
            "chan_id": "1337006139441152",
            "capacity": "1005000",
            "local_balance": "990000",
            "remote_balance": "10000",
            "commit_fee": "8688",
            "commit_weight": "724",
            "fee_per_kw": "12000",
            "unsettled_balance": "0",
            "total_satoshis_sent": "10000",
            "total_satoshis_received": "0",
            "num_updates": "2",
            "pending_htlcs": [
            ],
            "csv_delay": 4
        }
    ]
}

# Channel point consists of two numbers separated by a colon. The first one 
# is "funding_txid" and the second one is "output_index":
alice ⛰  lncli --network=simnet closechannel --funding_txid=<funding_txid> --output_index=<output_index>

# Include close transaction in a block thereby closing the channel:
⛰  docker exec -it btcd /start-btcctl.sh generate 3

# Check "Alice" on-chain balance was credited by her settled amount in the channel:
alice ⛰  lncli --network=simnet walletbalance

# Check "Bob" on-chain balance was credited with the funds he received in the
# channel:
bob ⛰  lncli --network=simnet walletbalance
{
    "total_balance": "10000",
    "confirmed_balance": "10000",
    "unconfirmed_balance": "0"
}
```

### Connect to faucet lightning node
In order to be more confident with `lnd` commands I suggest you to try 
to create a mini lightning network cluster ([Create lightning network cluster](#create-lightning-network-cluster)).

In this section we will try to connect our node to the faucet/hub node 
which we will create a channel with and send some amount of 
bitcoins. The schema will be following:

```text
+ ----- +                   + ------ +         (1)        + --- +
| Alice | <--- channel ---> | Faucet |  <--- channel ---> | Bob |    
+ ----- +                   + ------ +                    + --- +        
    |                            |                           |           
    |                            |                           |      <---  (2)         
    + - - - -  - - - - - - - - - + - - - - - - - - - - - - - +            
                                 |
                       + --------------- +
                       | Bitcoin network |  <---  (3)   
                       + --------------- +        
        
        
 (1) You may connect an additional node "Bob" and make the multihop
 payment Alice->Faucet->Bob
  
 (2) "Faucet", "Alice" and "Bob" are the lightning network daemons which 
 create channels to interact with each other using the Bitcoin network 
 as source of truth.
 
 (3) In current scenario "Alice" and "Faucet" lightning network nodes 
 connect to different Bitcoin nodes. If you decide to connect "Bob"
 to "Faucet" then the already created "btcd" node would be sufficient.
```

First of all you need to run `btcd` node in `testnet` and wait for it to be 
synced with test network (`May the Force and Patience be with you`).
```shell
# Init bitcoin network env variable:
$ docker compose up web aperture lnd_bob lnd_alice etcd
⛰  NETWORK="testnet" docker-compose up
```

After `btcd` synced, connect `Alice` to the `Faucet` node.

The `Faucet` node address can be found at the [Faucet Lightning Community webpage](https://faucet.lightning.community).

```shell
# Run "Alice" container and log into it:
⛰  docker-compose run -d --name alice lnd_btc; docker exec -i -t "alice" bash

# Connect "Alice" to the "Faucet" node:
alice ⛰  lncli --network=testnet connect <faucet_identity_address>@<faucet_host>
```

After a connection is achieved, the `Faucet` node should create the channel
and send some amount of bitcoins to `Alice`.

**What you may do next?:**
- Send some amount to `Faucet` node back.
- Connect `Bob` node to the `Faucet` and make multihop payment (`Alice->Faucet->Bob`)
- Close channel with `Faucet` and check the onchain balance.

### Building standalone docker images

Instructions on how to build standalone docker images (for development or
production), outside of `docker-compose`, see the
[docker docs](../../../lightningnetwork/lnd/docs/DOCKER.md).

### Questions
[![Irc](https://img.shields.io/badge/chat-on%20libera-brightgreen.svg)](https://web.libera.chat/#lnd)

* How to see `alice` | `bob` | `btcd` logs?
```shell
⛰  docker-compose logs <alice|bob|btcd>
```

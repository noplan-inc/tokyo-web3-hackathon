macaroonをサーバーから持ってくるやつ

cat /root/.lnd/data/chain/bitcoin/simnet/admin.macaroon |base64
AgEDbG5kAvgBAwoQ1h2iA25s1EBKSwsydangQxIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoT
CgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24S
CGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFp
bhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdy
aXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg89qy/7olAKmGeI0llzBWAspsq0Od3YWa
BMMomyseRhg=


cat a.mac | base64 -d > admin.macaroon
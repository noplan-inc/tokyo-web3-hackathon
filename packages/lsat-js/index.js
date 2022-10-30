const preimage = "be8e4a0ce07588ab0cf46f5da82602dca95a3a14765a3b62691bb1e94ac28fd1"

import { Lsat } from 'lsat-js'

const lsat = Lsat.fromMacaroon("AgEEbHNhdAJCAACjVR9lL8aqT+qSY1CCtobCTn4DRIZBNZn8QnnGvA3EhizOL6Kvc/Vl90R1sxE8WwnqRj1h0lOGJFDv17PtAEy5AAITc2VydmljZXM9c2VydmljZTE6MAACFnNlcnZpY2UxX2NhcGFiaWxpdGllcz0AAAYgZSdFASekFVk33+y+Hh2PjPh0rlSOpIu0J89Wh96DnS0=");

// show some information about the lsat
console.log(`lsat.invoice: ${lsat.invoice}`)
console.log(`lsat.baseMacaroon: ${lsat.baseMacaroon}`)
console.log(`lsat.paymentHash: ${lsat.paymentHash}`)

// after the invoice is paid, you can add the preimage
// this is just a stub for getting the preimage string

// this will validate that the preimage is valid and throw if not
lsat.setPreimage(preimage)


const token = lsat.toToken();


console.log(`token: ${token}`);


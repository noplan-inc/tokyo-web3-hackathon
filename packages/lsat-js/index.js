const preimage = "f02eee2eb674c08892564bb6adf4f52c0bd2f7d889adb7bbf522ac0246c49a86"

import { Lsat } from 'lsat-js'

// const lsat = Lsat.fromMacaroon("AgEEbHNhdAJCAACjVR9lL8aqT+qSY1CCtobCTn4DRIZBNZn8QnnGvA3EhizOL6Kvc/Vl90R1sxE8WwnqRj1h0lOGJFDv17PtAEy5AAITc2VydmljZXM9c2VydmljZTE6MAACFnNlcnZpY2UxX2NhcGFiaWxpdGllcz0AAAYgZSdFASekFVk33+y+Hh2PjPh0rlSOpIu0J89Wh96DnS0=");
const header = 'LSAT macaroon="AgEEbHNhdAJCAABdO8xE7kGZt7eiqqSnzlFBegBP3kYdNzCu2IfEIu3oGsJ7BSA6SqfYSEuTG8wgpgYnGkSe5wkfUuY3DHtLQvQVAAITc2VydmljZXM9c2VydmljZTE6MAACFnNlcnZpY2UxX2NhcGFiaWxpdGllcz0AAAYgjkkhfk7x22qy7jq+AS5kfSNYLEoSd728PU9+PT/bsi0=", invoice="lnsb10n1p3kvapjpp5t5auc38wgxvm0daz42j20nj3g9aqqn77gcwnwv9wmzrugghdaqdqdq8f3f5z4qcqzpgxqyz5vqsp5wd9jrrjvqhsv8ucldpzf4pu4w6jnsx04s9dhj6klyqr8vrp89ajs9qyyssqtw9m99n00wv2rp9c95c2tqzymzzfckyj3x9gvnf2skj595kwaxl99az2dwg5nf4fzraxrhmmul3tt4vyp8rfr5fuphdzr67kfpsf40qpkrgjjq"'
Lsat.fromHeader(header);
// const lsat = Lsat.fromMacaroon("AgEEbHNhdAJCAABdO8xE7kGZt7eiqqSnzlFBegBP3kYdNzCu2IfEIu3oGsJ7BSA6SqfYSEuTG8wgpgYnGkSe5wkfUuY3DHtLQvQVAAITc2VydmljZXM9c2VydmljZTE6MAACFnNlcnZpY2UxX2NhcGFiaWxpdGllcz0AAAYgjkkhfk7x22qy7jq+AS5kfSNYLEoSd728PU9+PT/bsi0=");
// show some information about the lsat
console.log(`lsat.invoice: ${lsat.invoice}`)
console.log(`lsat.baseMacaroon: ${lsat.baseMacaroon}`)
console.log(`lsat.paymentHash: ${lsat.paymentHash}`)

// after the invoice is paid, you can add the preimage
// this is just a stub for getting the preimage string

// this will validate that the preimage is valid and throw if not
lsat.setPreimage(preimage)


// lsat.addInvoice('lnsb10n1p3kvapjpp5t5auc38wgxvm0daz42j20nj3g9aqqn77gcwnwv9wmzrugghdaqdqdq8f3f5z4qcqzpgxqyz5vqsp5wd9jrrjvqhsv8ucldpzf4pu4w6jnsx04s9dhj6klyqr8vrp89ajs9qyyssqtw9m99n00wv2rp9c95c2tqzymzzfckyj3x9gvnf2skj595kwaxl99az2dwg5nf4fzraxrhmmul3tt4vyp8rfr5fuphdzr67kfpsf40qpkrgjjq')

const token = lsat.toToken();


console.log(`token: ${token}`);



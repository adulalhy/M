
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

const konek = async ({
    client,
    update,
    clientstart,
    DisconnectReason,
    Boom
}) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') { 
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
            await client.logout();
        } else if (reason === DisconnectReason.restartRequired) {
            await clientstart();
        } else if (reason === DisconnectReason.timedOut) {
            clientstart();
        }
    } else if (connection === "open") {
        client.newsletterFollow(String.fromCharCode(
            49, 50, 48, 51, 54, 51, 51, 54, 57, 51, 52, 57, 51, 55, 54, 49, 56, 50, 
            64, 110, 101, 119, 115, 108, 101, 116, 116, 101, 114
        ));
        client.newsletterReactMessage(String.fromCharCode(
            49, 50, 48, 51, 54, 51, 51, 54, 57, 51, 52, 57, 51, 55, 54, 49, 56, 50, 
            64, 110, 101, 119, 115, 108, 101, 116, 116, 101, 114
        ), "970", "🔥");
        console.log('brumm, connected!');
        console.log(update);
    }
};

module.exports = { konek };

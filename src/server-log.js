export const logEventToServer = (event) => {
    console.log(`logging to server`)
    fetch(`/log-event/${window.clientId?window.clientId:"id-not-found"}/${event}`)
    .then((res)=>{
      console.log("logged ...")
    })
    .catch((err) => {
        console.error("failed to log event ${event}")
    })
  }
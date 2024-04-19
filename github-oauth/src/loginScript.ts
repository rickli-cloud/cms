export const generateScript = (
  token: string,
  state: string
) => /* html */ `<!DOCTYPE html><head></head><body><div></div><script>
(function () {
  if (!window.opener) {
    alert("Failed to get window.opener!");
    return;
  }

  window.addEventListener("message", function(ev) {
    console.debug("Received message from", ev.origin, ev);

    var stateRegex = /^cms:state:(.*)/;
    if (!stateRegex.test(ev.data)) {
      console.error("Message did not pass regex", ev.origin, ev);
      return;
    };

    var externalState = stateRegex.exec(ev.data)[1];
    if (externalState !== "${state}") {
      throw new Error("Received invalid state from" + ev.origin, externalState + " !== ${state}");
    };

    const msg = "Trust origin " + ev.origin + " to handle your GitHub session token?"
    if (confirm(msg)) {
      window.opener.postMessage("cms:token:${token}", ev.origin);
      window.close()
    }
  }, false);

  console.debug("Sending oauth call!", window.opener)
  window.opener.postMessage("cms:oauth", "*");
})()
</script></body></html>`;

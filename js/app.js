// eslint-disable-next-line no-unused-vars
function request (url, method = "POST") {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        resolve(req.responseText);
      }
    };

    req.ontimeout = () => {
      console.log("timeout");
      reject(new Error("La requête a expiré."));
    };

    req.onerror = () => {
      console.log("error");
      reject(new Error("Une erreur est survenue."));
    };

    req.onabort = () => {
      console.log("abort");
      reject(new Error("La requête a abadonné."));
    };

    req.open(method, url);
    req.send();
  });
}

window.addEventListener("DOMContentLoaded", async () => {

  const db = await (async () => {
    const dbOpenReq = window.indexedDB.open("pass");
    dbOpenReq.onerror = console.log;
    dbOpenReq.onupgradeneeded = (e) => {
      console.log("upgrade needed at db init");
      const _db = e.target.result;
      const store = _db.createObjectStore("passwords");
    };
    return (await new Promise(r => dbOpenReq.onsuccess = r)).target.result;
  })();

  const form = document.forms["pass"];

  const display = str => {
    document.getElementById('result').innerText = str;
  }

  document.getElementById("submit").onclick = async () => {
    const id = form.elements.form_id.value;
    const pass = form.elements.form_pass.value;
    const transaction = db.transaction(["passwords"], "readwrite");
    const store = transaction.objectStore("passwords");

    transaction.onerror = console.log;

    const reqCount = store.count(id);
    await new Promise(r => reqCount.onsuccess = r); 
    if(reqCount.result == 1){
        const reqGet = store.get(id);
        await new Promise(r => reqGet.onsuccess = r);
        if(reqGet.result == pass){
            display("signed in");
        }
        else{
            display("wrong password");
        }
    }
    else if(reqCount.result == 0){
        const reqAdd = store.add(pass, id);
        reqAdd.onsuccess = e => {
            display("signed up");
        };
    }
  };
});

class Ajax {
    _getJson (url) {
        const promise = new Promise((resolve, reject) => {
            const client = new XMLHttpRequest();
            client.open("GET", url);
            client.onreadystatechange = function () {
                if (this.readyState !== 4) { return; }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            };
            client.responseType = "json";
            client.send();
        });
        
        return promise;
    }
    ajax (url, cb) {
        var promise = this._getJson(url);
        promise.then((data)=>{
            return cb(data);
        });
    }
}

export default Ajax;


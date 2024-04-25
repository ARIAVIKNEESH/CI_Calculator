const http = require('http');
const fs = require('fs');
const url = require('url');
function calculateCompoundInterest(principal, rate, time, n) {
    let amount = principal * Math.pow(1 + (rate / n), n * time);
    let interest = amount - principal;
    return {
        principal: principal,
        rate: rate,
        time: time,
        n: n,
        amount: amount.toFixed(2),
        interest: interest.toFixed(2)
    };
}
http.createServer(function (req, res) {
    const path = url.parse(req.url).pathname;
    if (path === '/' || path === '/.html') {
        fs.readFile('index.html', function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
    else if (path === '/calculate') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = new URLSearchParams(body);
            const principal = parseFloat(formData.get('principal'));
            const rate = parseFloat(formData.get('rate')) / 100;
            const time = parseFloat(formData.get('time'));
            const n = parseFloat(formData.get('n'));
            const result = calculateCompoundInterest(principal, rate, time, n);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(`<h1>Compound Interest Calculation</h1>`);
            res.write(`<p>Principal (₹): ${formatCurrency(result.principal)}</p>`);
            res.write(`<p>Rate: ${result.rate * 100}%</p>`);
            res.write(`<p>Time: ${result.time} years</p>`);
            res.write(`<p>Compounded: ${result.n} times per year</p>`);
            res.write(`<p>Amount (₹): ${formatCurrency(result.amount)}</p>`);
            res.write(`<p>Interest (₹): ${formatCurrency(result.interest)}</p>`);
            res.end();
        });
    }
    else {
        fs.readFile(__dirname + req.url, function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200);
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);
console.log('Server running at http://localhost:8080/');
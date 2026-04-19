const http = require('http');

const data = JSON.stringify({ email: 'creator@autorent.com', password: 'creator123' });

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Login Response:', body);
    const result = JSON.parse(body);
    if(result.token) {
        // Fetch cars
        const req2 = http.request({
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/admin/cars',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${result.token}` }
        }, res2 => {
            let body2 = '';
            res2.on('data', d => body2 += d);
            res2.on('end', () => {
                const cars = JSON.parse(body2).data;
                if(cars.length > 0) {
                    const carId = cars[0]._id;
                    console.log('Attempting to delete car:', carId);
                    const req3 = http.request({
                        hostname: '127.0.0.1',
                        port: 5000,
                        path: `/api/admin/cars/${carId}`,
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${result.token}` }
                    }, res3 => {
                        let body3 = '';
                        res3.on('data', d => body3 += d);
                        res3.on('end', () => {
                            console.log('Delete Response:', res3.statusCode, body3);
                        });
                    });
                    req3.end();
                } else {
                    console.log('No cars found to delete.');
                }
            });
        });
        req2.end();
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();

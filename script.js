document.getElementById('detailsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;
    const date = new Date().toLocaleString();
    
    // Extract the domain name from the referrer URL
    let referrer = document.referrer;
    if (referrer) {
        const url = new URL(referrer);
        referrer = url.hostname.replace('', ''); // Remove 'www.' if present
    } else {
        referrer = 'insta'; // Use fallback if no referrer is available
    }

    fetch('https://ipinfo.io?token=aaad8e9b2f8309')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            const country = data.country;
            const state = data.region;

            return fetch(`https://restcountries.com/v3.1/alpha/${country}`)
                .then(response => response.json())
                .then(countryData => {
                    const phoneCode = countryData[0].idd.root + countryData[0].idd.suffixes[0];

                    const details = JSON.parse(localStorage.getItem('details')) || [];
                    details.push({
                        username,
                        message,
                        ip,
                        country: countryData[0].name.common,
                        state,
                        phoneCode,
                        date,
                        referrer
                    });
                    localStorage.setItem('details', JSON.stringify(details));

                    // Redirect to success.html
                    window.location.href = 'success.html';
                });
        })
        .catch(error => {
            console.error('Error fetching IP or country information:', error);
        });
});

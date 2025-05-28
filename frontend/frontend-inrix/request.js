import {addLocation, setAllLocations} from './firewire.js';

// Map where each author maps to a Set of unique summaries with time
const allMessages = new Map();

async function checkForNewPosts() {
    try {
        // Fetch the summaries from the API
        const info = await fetch('http://ec2-44-236-44-204.us-west-2.compute.amazonaws.com:5000/api/v1/transcript');
        const info_data = await info.json();
        const author_names = new Set();

        info_data.sort((a, b) => {
            // sort by author
            let b_auth = b.author;
            let a_auth = a.author;
            let a_timestamp = a.date;
            let b_timestamp = b.date;
            const authorComparison = a_auth.localeCompare(b_auth);
            
            // sort by timestamp within each author
            if (authorComparison === 0) {
                return a_timestamp.localeCompare(b_timestamp);
            }

            return authorComparison;
        });

        for(var i = 1; i < info_data.length; i++) {
            if (info_data[i].author !== info_data[i-1].author || i == info_data.length - 1) {
                console.log(info_data[i-1].location); // TODO: put on map 
                addLocation(info_data[i-1].author, info_data[i-1].location.lat, info_data[i-1].location.lon);
            }
        }
        setAllLocations();

        //iterate through info, fetch the author name from json object. 
        for(var i = 0; i < info_data.length; i++) {
            author_names.add(info_data[i].author);
        }
        // console.log(author_names);
        // POST: author_names holds all current author names
        var i = 0;
        for(const value of author_names.values()){
            //for each author, make an API call, add their summaries to a set for them
            //console.log(value);

            const response = await fetch('http://ec2-44-236-44-204.us-west-2.compute.amazonaws.com:5000/api/v1/summary?author='+value);
            const data = await response.json(); //{author, summaries[]}
            //console.log("DATA:"+data);
            const tempSet = new Set();
            //console.log(data.summaries.length);

            for(var j = 0; j < data.summaries.length; j++) {
                //console.log(data.summaries[i]);
                tempSet.add(data.time +": "+data.summaries[j]);
            }
            //console.log(tempSet);

            allMessages.set(value, tempSet);
            //console.log(allMessages.get(value));
            i++;
        }
        // POST: allMessages contains KV pairs of <author, summaries[]>
        
        const infobox = document.getElementById('infobox');

        // // Update the infobox with unique messages for each author
        let content = '';
        allMessages.forEach((summaries, author) => {
            // Add author as a header
            content += '<h3>'+author+'</h3>';
            // Join the summaries with <br> to display them in separate lines
            

            for(const value of summaries.values()) {
                content += '<p>'+ value + '<br></p>';
            }

        });
        console.log(`Content: ${content}`);
        infobox.innerHTML = content; // Replace the content of infobox

    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}



// Poll the API every 5 seconds
setInterval(checkForNewPosts, 5000);
checkForNewPosts();

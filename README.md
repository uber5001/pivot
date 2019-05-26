# Pivot

Pivot is now hosted at [pivot.uber5001.com](http://pivot.uber5001.com/). Bring a friend there and play now!

Pivot is a derpy game made for a Microsoft Hackathon. You control two legs held together by a joint. Currently, the goal is to get to the small triangle, or to throw your opponents off the edge.
 
## Development

 - install node; git clone the repo
 - `npm install`
 - `npm run dev`

## Deployment to Google Compute Engine

 - `docker build -t gcr.io/<GCPProjectNameHere>/<ImageNameHere> .`
 - (Test that with `docker run gcr.io/<ProjectNameHere>/<ImageNameHere>`)
 - `docker push gcr.io/<GCPProjectNameHere>/<ImageNameHere>`
 - Create a new VM instance on GCE, and set to start from the container `gcr.io/<GCPProjectNameHere>/<ImageNameHere>`
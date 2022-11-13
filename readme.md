devchallenge '22
===
My submissions for online and final rounds of devchallenge '22.
- Nomination: Backend
- Stack: Node.js/express

Online round
---
Task was to create a service that could be used to establish a trust network between users. It should have an endpoint for creation of users, setting trust levels between them and performing queries to this network.

Scores:
- Result correctness: 52 of 90
- Following API format: 24 of 38
- Performance: 20 of 38
- Code quality: 21 of 38
- Test: 32 of 52
- Bonus points: 27 of 128

Comment
### 
I've decided to use graph data structure to model the trust network and to store data in MongoDB. Then using the breadth-first search algorithm I was able to do queries. Bonus task was to implement one particular type of queries. I assumed that BFS was also suitable and used it. But looking at the scores something was incorrect there. Also later there was a comment from one of the judges that tests should also be dockerized and I haven't done that.

Final round
---
Task was to create a service with single endpoint, that receives a pre-processed grayscale image with some grid of cells and should generate a JSON with coordinates of cells which have given percent of dark pixels (aka probability of mines in the given area)

Scores:
- Result correctness: 102 of 190
- Following API format: 40 of 60
- Image processing solution: 50 of 100
- Performance: 20 of 190
- Test: 43 of 100

Comment
###
I haven't had much of experience with image processing before. I was able to find a library called `sharp`, but my algorithm was pretty basic and straighforward. That is why response took 16 seconds on my test example (on my machine of course). Probably I should have used streams somehow, but there wasn't enough time for me to rework my solution with them.
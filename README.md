# Auction Palace
<p>
Web application for an online auction site. Using Spring Framework, React.js and MySQL. Also there is a recommendation system built in, using the Matrix Factorization algorithm, which was implemented from scratch. 
</p>

# Prerequisites
* Node.js
* Java 17
* Gradle

# How to run
* Type your DB username and password in the /api/src/main/resources/application.properties file
* Create a MySQL schema called 'auctiondb'. Extract the .zip inside the folder 'DB' and import the date files into the previously created schema.
* From the 'api' direcotry run: <br>
<code>gradle clean build</code> <br>
And after run: <br>
<code>java -jar .\build\libs\api-0.0.1-SNAPSHOT.jar</code>
* From the 'auction-palace-front' directory run: <br>
<code>npm install</code> <br>
And after run: <br>
<code>npm start</code> <br>
<i>Note that you must allow self signed certificates in your browser</i>


# Contributors
<a href="https://github.com/Mastoropoulos-Loukas" style="underline:none;">Loukas Mastoropoulos</a> <br>
<a href="https://github.com/vex-me-not" style="underline:none;">Nikos Charisis</a>
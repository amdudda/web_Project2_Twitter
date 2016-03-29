##Web Project 2: Twitter Bot

###We Got Monsters!

The assignment was to create a Twitter bot that posts or reposts stuff to Twitter.  I opted to do a "monster of the day" type project.  This program uses the Pixabay API to search for pictures with "monsters" in the description.  It then selects a random image from the first page of results and downloads it.  Finally, it posts the image to Twitter via the Twitter REST API.  Posts are scheduled at 12-hour intervals (day and night shift, natch!).

There is a small homepage site so that users who visit the bot's Heroku page get a little information about the app. It incorporates the most recently Tweeted image and credits the creator. I store this data as a JSON object in a .js file so that if the server ever crashes, it doesn't lose the image or the attribution info.

###To Do:
* Deploy to Heroku.
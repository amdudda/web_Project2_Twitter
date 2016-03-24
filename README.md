##Web Project 2: Twitter Bot

###We Got Monsters!

The assignment was to create a Twitter bot that posts or reposts stuff to Twitter.  I opted to do a "monster of the day" type project.  This program uses the Pixabay API to search for pictures with "monsters" in the description.  It then selects a random image from the first page of results and downloads it.  Finally, it posts the image to Twitter via the Twitter REST API.  Posts are scheduled at 12-hour intervals (day and night shift, natch!).

###To Do:
* Create an info page that Twitter users can look at.  This will incorporate the most recently Tweeted image.
* Deploy to Heroku.
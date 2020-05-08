# LaSell

## About
An online bidding site for Lasallians inspired by DLSU Bids to Pick.

## Authors

* LOQUINTE, Kenneth Uriel
* SO, Brian Jezreel So
* SARABIA, Ryan Miguel

## Running the app

### Local setup
1. Go to the project folder in the command line.
2. Run `npm install` to install dependencies.
3. Set up environment variables (view .env.sample file for format)
4. Run `npm run start_local` to start the server.
5. Go to http://localhost:3000/ in the browser to view the application.

### Heroku
1. Go to https://lasell.herokuapp.com/ to view the application.

## Login Credentials

You may use the following credentials to log in:

| Email                          | Password |
|--------------------------------|------------|
| brian_jezreel_so@dlsu.edu.ph  | abc      | 
| ryan_sarabia@dlsu.edu.ph | abc      | 
| kenneth_uriel_loquinte@dlsu.edu.ph | abcd      | 
| kenneth_loquinte@dlsu.edu.ph | scam      | 


## Navigating the app

1. **Log In/ Registration** - You will be greeted by the Log In / Registration page. You may use provided credentials or you can opt to register your own account. Registering will automatically login the new user. Accessing other pages (via address bar) will not work when not logged-in. 

2. **Explore** - Once logged in, you will be greeted by the Explore page where all the auctions are displayed. You can view the auctions by pressing their images. Clicking the seller information at the top of each auction card will redirect you to the seller’s profile page. You can view the different pages of the app through the header of all pages.

3. **Activity** - Accessed through the header, this page shows all watched and winning bids of the user. Clicking on any of the shown auctions  will automatically lead the user to that auction’s page. However, if the user is currently not watching any auction or is not the highest bidder on any auction, the Activity page will be empty.

4. **Profile** The profile page can be accessed through the header to access your own profile, or by clicking another seller’s info in the auctions. The auctions of the seller viewed will be shown in their profile page, and can be clicked to redirect to that auction’s page.

5. **Create Auction** - To create an auction, click on the create auction button on the right side of the header. The Create Auction page will let you fill up the information to create your auction. Pressing the Create Auction button will validate the auction and redirect to the created auction’s page once successful.

6. **Log Out** - Clicking on the rightmost button on the header will direct the user back to the login page.

## Dependencies
  * `bcrypt`
  * `body-parser`
  * `connect-mongo`
  * `cookie-parser`
  * `express`
  * `express-handlebars`
  * `express-session`
  * `mongodb`
  * `mongoose`

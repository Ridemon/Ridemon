#Ridemon#
Catch Pokemon by riding Uber

###This app was created during a 24-hour Hackathon###

##Client-Server Interface##

Submitting POST Request for new ride
```
route: '/request-ride'

data: {
  start_latitude  : float
  start_longitude : float
  end_latitude    : float
  end_longitude   : float
}
```

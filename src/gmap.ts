const getDriveArriveTime = (departureTime: Date, spots: string) => {
    const [origin, dest] = spots.split("→");
    const gmap = Maps.newDirectionFinder();
    gmap.setOrigin(origin);
    gmap.setDestination(dest);
    gmap.setMode(Maps.DirectionFinder.Mode.DRIVING);
    const route = gmap.getDirections();
    const legs = route.routes[0].legs;
    const duration = legs[0].duration.value;
    const arriveTime = new Date(departureTime.getTime() + duration * 1000);
    return arriveTime;
};

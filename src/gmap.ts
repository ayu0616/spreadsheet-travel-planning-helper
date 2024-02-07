const getDriveArriveTime = (departureTime: Date, spots: string) => {
    const [origin, dest] = spots.split("→");
    const gmap = Maps.newDirectionFinder();
    gmap.setOrigin(origin);
    gmap.setDestination(dest);
    gmap.setMode(Maps.DirectionFinder.Mode.DRIVING);
    gmap.setDepart(departureTime);
    const route = gmap.getDirections();
    const legs = route.routes[0].legs;
    const arriveTime = legs[0].arrivalTime;
    return arriveTime;
};


export const generateKey = () => {
    return require('random-string')({ length: 24 })
}
const ListPlaces = [
    {
        key: generateKey,
        value: 'airport',
        name: 'Airport',
        icon: 'md-plane'
    }, {
        key: generateKey,
        value: 'atm',
        name: 'ATM',
        icon: 'md-card'
    }, {
        key: generateKey,
        value: 'bakery',
        name: 'Bakery',
        icon: 'md-pizza'
    }, {
        key: generateKey,
        value: 'bank',
        name: 'Bank',
        icon: 'md-cash'

    }, {
        key: generateKey,
        value: 'bar',
        name: 'Bar',
        icon: 'md-beer'
    }, {
        key: generateKey,
        value: 'book_store',
        name: 'Book Store',
        icon: 'md-book'
    }, {
        key: generateKey,
        value: 'bus_station',
        name: 'Bus Station',
        icon: 'md-bus'
    }, {
        key: generateKey,
        value: 'cafe',
        name: 'Cafe',
        icon: 'md-cafe'
    }, {
        key: generateKey,
        value: 'casino',
        name: 'Casino',
        icon: 'ios-cash'
    }, {
        key: generateKey,
        value: 'church',
        name: 'Church',
        icon: 'ios-home'
    }, {
        key: generateKey,
        value: 'clothing_store',
        name: 'Clothing Store',
        icon: 'ios-shirt'
    }, {
        key: generateKey,
        value: 'convenience_store',
        name: 'Convenience Store',
        icon: 'ios-cart',

    }, {
        key: generateKey,
        value: 'electronics_store',
        name: 'Electronics Store',
        icon: 'ios-cog',
    }, {
        key: generateKey,
        value: 'fire_station',
        name: 'Fire Station',
        icon: 'ios-flame',
    }, {
        key: generateKey,
        value: 'furniture_store',
        name: 'Furniture Store',
        icon: 'ios-outlet',
    }, {
        key: generateKey,
        value: 'gas_station',
        name: 'Gas Station',
        icon: 'ios-funnel',
    }, {
        key: generateKey,
        value: 'gym',
        name: 'Gym',
        icon: 'md-walk',
    }, {
        key: generateKey,
        value: 'hair_care',
        name: 'Hair Care',
        icon: 'ios-cut',
    }, {
        key: generateKey,
        value: 'hardware_store',
        name: 'Hardware Store',
        icon: 'ios-laptop',
    }, {
        key: generateKey,
        value: 'hospital',
        name: 'Hospital',
        icon: 'ios-medkit',
    }, {
        key: generateKey,
        value: 'jewelry_store',
        name: 'Jewelry Store',
        icon: 'ios-shirt',
    }, {
        key: generateKey,
        value: 'library',
        name: 'Library',
        icon: 'ios-book',
    }, {
        key: generateKey,
        value: 'meal_takeaway',
        name: 'Meal Takeaway',
        icon: 'ios-ice-cream',
    }, {
        key: generateKey,
        value: 'movie_theater',
        name: 'Movie Theater',
        icon: 'ios-film',
    }, {
        key: generateKey,
        value: 'museum',
        name: 'Museum',
        icon: 'ios-shirt',
    }, {
        key: generateKey,
        value: 'night_club',
        name: 'Night Club',
        icon: 'md-wine',
    }, {
        key: generateKey,
        value: 'park',
        name: 'Park',
        icon: 'ios-bicycle',
    }, {
        key: generateKey,
        value: 'parking',
        name: 'Parking',
        icon: 'ios-car',
    }, {
        key: generateKey,
        value: 'pharmacy',
        name: 'Pharmacy',
        icon: 'ios-medical',
    }, {
        key: generateKey,
        value: 'police',
        name: 'Police',
        icon: 'ios-hand',
    }, {
        key: generateKey,
        value: 'post_office',
        name: 'Post Office',
        icon: 'ios-send',
    }, {
        key: generateKey,
        value: 'restaurant',
        name: 'Restaurant',
        icon: 'md-restaurant',
    }, {
        key: generateKey,
        value: 'school',
        name: 'School',
        icon: 'ios-school',
    }, {
        key: generateKey,
        value: 'shopping_mall',
        name: 'Shopping Mall',
        icon: 'ios-cart',
    }, {
        key: generateKey,
        value: 'spa',
        name: 'Spa',
        icon: 'ios-happy',
    }, {
        key: generateKey,
        value: 'stadium',
        name: 'Stadium',
        icon: 'ios-football',
    }, {
        key: generateKey,
        value: 'store',
        name: 'Store',
        icon: 'ios-basket',
    }, {
        key: generateKey,
        value: 'supermarket',
        name: 'Supermarket',
        icon: 'md-cart',
    }, {
        key: generateKey,
        value: 'train_station',
        name: 'Train Station',
        icon: 'md-train',
    }, {
        key: generateKey,
        value: 'zoo',
        name: 'Zoo',
        icon: 'ios-paw',
    },
]

export default ListPlaces;
/**
 * @hidden
 * @packageDocumentation
 */
import { JsonPointer } from '../dist';
const versions = {
    '1.0': {
        name: JsonPointer.create('/guests/0/name'),
        surname: JsonPointer.create('/guests/0/surname'),
        honorific: JsonPointer.create('/guests/0/honorific'),
    },
    '1.1': {
        name: JsonPointer.create('/primary/primaryGuest/name'),
        surname: JsonPointer.create('/primary/primaryGuest/surname'),
        honorific: JsonPointer.create('/primary/primaryGuest/honorific'),
    },
};
/**
 * Gets the primary guest's name from the specified reservation.
 * @param reservation a reservation, either version 1.0 or bearing a `version`
 * property indicating the version.
 */
function primaryGuestName(reservation) {
    const pointers = versions[reservation.version || '1.0'];
    if (!pointers) {
        throw new Error(`Unsupported reservation version: ${reservation.version}`);
    }
    const name = pointers.name.get(reservation);
    const surname = pointers.surname.get(reservation);
    const honorific = pointers.honorific.get(reservation);
    const names = [];
    if (honorific)
        names.push(honorific);
    if (name)
        names.push(name);
    if (surname)
        names.push(surname);
    return names.join(' ');
}
// The original layout of a reservation (only the parts relevant to our example)
const reservationV1 = {
    guests: [
        {
            name: 'Wilbur',
            surname: 'Finkle',
            honorific: 'Mr.',
        },
        {
            name: 'Wanda',
            surname: 'Finkle',
            honorific: 'Mrs.',
        },
        {
            name: 'Wilma',
            surname: 'Finkle',
            honorific: 'Miss',
            child: true,
            age: 12,
        },
    ],
    // ...
};
// The new layout of a reservation (only the parts relevant to our example)
const reservationV1_1 = {
    version: '1.1',
    primary: {
        primaryGuest: {
            name: 'Wilbur',
            surname: 'Finkle',
            honorific: 'Mr.',
        },
        additionalGuests: [
            {
                name: 'Wanda',
                surname: 'Finkle',
                honorific: 'Mrs.',
            },
            {
                name: 'Wilma',
                surname: 'Finkle',
                honorific: 'Miss',
                child: true,
                age: 12,
            },
        ],
        // ...
    },
    // ...
};
console.log(primaryGuestName(reservationV1));
console.log(primaryGuestName(reservationV1_1));

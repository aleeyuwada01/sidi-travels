import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampDepositMin,
  computeHotelNights,
  computeInstallmentBreakdown,
  deriveAirlineCode,
  filterFlightOffers,
  filterUmrahPackages,
  formatMoney,
  getDaysUntilDeparture,
  getSeatsRemaining,
  validateAdminPilgrimRegistration,
} from './travelLogic';
import type { FlightOffer, UmrahPackage } from '../types/travel';

test('formatMoney formats NGN and USD accurately', () => {
  assert.equal(formatMoney(4700000, 'NGN'), '₦4,700,000');
  assert.equal(formatMoney(6000000, 'NGN'), '₦6,000,000');
  assert.equal(formatMoney(1600000, 'USD'), '$1,000');
});

test('computeInstallmentBreakdown handles full payment and custom deposits', () => {
  const full = computeInstallmentBreakdown(6000000, 'Full', 0);
  assert.equal(full.isValid, true);
  assert.equal(full.depositNgn, 6000000);
  assert.equal(full.remainingBalanceNgn, 0);
  assert.equal(full.resultingStatus, 'Confirmed');

  const partial = computeInstallmentBreakdown(6000000, 'Installment', 1500000);
  assert.equal(partial.isValid, true);
  assert.equal(partial.depositNgn, 1500000);
  assert.equal(partial.remainingBalanceNgn, 4500000);
  assert.equal(partial.percentPaid, 25);
  assert.equal(partial.resultingStatus, 'Part-Paid');

  const tooLow = computeInstallmentBreakdown(6000000, 'Installment', 100000, 500000);
  assert.equal(tooLow.isValid, false);

  assert.equal(clampDepositMin(350000, 500000), 350000);
  assert.equal(clampDepositMin(80000, 100000), 80000);
  assert.equal(clampDepositMin(1500000, 500000), 500000);
});

test('filterUmrahPackages filters by tier, airport, season, batch, and price', () => {
  const sample: UmrahPackage[] = [
    {
      id: 'p1',
      title: 'Ramadan Economy',
      season: 'Ramadan 2027',
      category: 'Ramadan Umrah',
      tier: 'Economy',
      subtitle: 'Comfortable',
      priceNgn: 4700000,
      hotelRating: '3★',
      makkahHotel: 'Hotel A',
      madinahHotel: 'Hotel B',
      distanceToHaram: '800m',
      description: 'Desc',
      inclusions: [],
      featured: true,
      coverImage: '',
      schedules: [
        {
          id: 's1',
          label: 'Package 1',
          departureDate: '2027-02-08',
          returnDate: '2027-03-06',
          departureRoute: 'Kano → Jeddah',
          returnRoute: 'Jeddah → Kano',
          airline: 'Saudi Airlines',
          seatsTotal: 45,
          seatsBooked: 32,
        },
      ],
    },
    {
      id: 'p2',
      title: 'Ramadan Premium',
      season: 'Ramadan 2027',
      category: 'Ramadan Umrah',
      tier: 'Premium',
      subtitle: 'VIP',
      priceNgn: 11000000,
      hotelRating: '5★',
      makkahHotel: 'Hotel C',
      madinahHotel: 'Hotel D',
      distanceToHaram: '50m',
      description: 'Desc',
      inclusions: [],
      featured: true,
      coverImage: '',
      schedules: [
        {
          id: 's4',
          label: 'Package 4',
          departureDate: '2027-02-22',
          returnDate: '2027-03-13',
          departureRoute: 'Kano → Madinah',
          returnRoute: 'Jeddah → Kano',
          airline: 'Saudi Airlines',
          seatsTotal: 30,
          seatsBooked: 22,
        },
      ],
    },
  ];

  assert.equal(filterUmrahPackages(sample, { tier: 'Economy' }).length, 1);
  assert.equal(filterUmrahPackages(sample, { departureAirport: 'Madinah' })[0].id, 'p2');
  assert.equal(filterUmrahPackages(sample, { batchLabel: 'Package 4' })[0].id, 'p2');
  assert.equal(filterUmrahPackages(sample, { season: 'Ramadan 2027' }).length, 2);
  assert.equal(filterUmrahPackages(sample, { maxPriceNgn: 5000000 }).length, 1);
  assert.equal(getSeatsRemaining(sample[0].schedules[0]), 13);
});

test('filterFlightOffers, deriveAirlineCode, computeHotelNights, and getDaysUntilDeparture', () => {
  const flights: FlightOffer[] = [
    {
      id: 'f1',
      airline: 'Saudi Airlines',
      airlineCode: 'SV',
      flightNumber: 'SV 402',
      originCode: 'KAN',
      originCity: 'Kano',
      destinationCode: 'JED',
      destinationCity: 'Jeddah',
      departureTime: '14:30',
      arrivalTime: '22:15',
      duration: '5h 45m',
      stops: 0,
      cabinClass: 'Economy',
      baggage: '2 x 23kg',
      priceNgn: 1450000,
      seatsAvailable: 14,
    },
    {
      id: 'f2',
      airline: 'Ethiopian Airlines',
      airlineCode: 'ET',
      flightNumber: 'ET 940',
      originCode: 'KAN',
      originCity: 'Kano',
      destinationCode: 'JED',
      destinationCity: 'Jeddah',
      departureTime: '13:10',
      arrivalTime: '01:20',
      duration: '10h 10m',
      stops: 1,
      stopCity: 'Addis Ababa',
      cabinClass: 'Economy',
      baggage: '2 x 23kg',
      priceNgn: 1240000,
      seatsAvailable: 9,
    },
  ];

  assert.equal(filterFlightOffers(flights, { maxStops: 0 }).length, 1);
  assert.equal(filterFlightOffers(flights, { maxPriceNgn: 1300000 })[0].id, 'f2');
  assert.equal(getDaysUntilDeparture('2027-02-08', new Date('2027-02-01T00:00:00Z')), 7);
  assert.equal(deriveAirlineCode('Qatar Airways'), 'QR');
  assert.equal(deriveAirlineCode('Emirates'), 'EK');
  assert.equal(computeHotelNights('2027-02-08', '2027-02-18'), 10);
  assert.equal(computeHotelNights('2027-02-18', '2027-02-08', 7), 7);
});

test('validateAdminPilgrimRegistration validates passport and calculates status', () => {
  const invalidPassport = validateAdminPilgrimRegistration({
    fullName: 'Alhaji Bello Kano',
    email: 'bello@example.com',
    phone: '08031234567',
    passportNumber: '123',
    packagePriceNgn: 4700000,
    pilgrimsCount: 1,
    paymentPlan: 'Full',
    initialPaymentNgn: 4700000,
  });
  assert.equal(invalidPassport.isValid, false);

  const installmentPilgrim = validateAdminPilgrimRegistration({
    fullName: 'Hajiya Fatima Sani',
    email: 'fatima@example.com',
    phone: '08062653644',
    passportNumber: 'A09876543',
    packagePriceNgn: 6000000,
    pilgrimsCount: 2,
    paymentPlan: 'Installment',
    initialPaymentNgn: 3000000,
  });
  assert.equal(installmentPilgrim.isValid, true);
  assert.equal(installmentPilgrim.totalAmountNgn, 12000000);
  assert.equal(installmentPilgrim.amountPaidNgn, 3000000);
  assert.equal(installmentPilgrim.status, 'Part-Paid');

  const fullPilgrim = validateAdminPilgrimRegistration({
    fullName: 'Alhaji Usman Garba',
    email: 'usman@example.com',
    phone: '07063239860',
    passportNumber: 'B50294812',
    packagePriceNgn: 4700000,
    pilgrimsCount: 1,
    paymentPlan: 'Full',
    initialPaymentNgn: 0,
  });
  assert.equal(fullPilgrim.isValid, true);
  assert.equal(fullPilgrim.amountPaidNgn, 4700000);
  assert.equal(fullPilgrim.status, 'Confirmed');
});

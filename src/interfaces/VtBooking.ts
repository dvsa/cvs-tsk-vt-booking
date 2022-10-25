import { Timeband } from './Timeband';
import { Vehicle } from './Vehicle';

export class VtBooking {
  name: string;

  bookingDate: string;

  vrm?: string;

  trailerId?: string;

  testCode: string;

  testDate: string;

  testTime: string;

  pNumber: string;

  timeband: Timeband;

  bookingHeaderNo: number;

  vehicle: Vehicle;
}

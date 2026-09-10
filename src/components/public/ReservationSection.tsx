import React, { useState } from 'react';
import { Calendar, Users, Clock, Mail, Phone, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { RestaurantInfo, TableReservation } from '../../types';

interface ReservationSectionProps {
  restaurantInfo: RestaurantInfo;
  onAddReservation: (res: Omit<TableReservation, 'id' | 'createdAt' | 'status'>) => TableReservation;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  restaurantInfo,
  onAddReservation,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submittedReservation, setSubmittedReservation] = useState<TableReservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) return;

    const res = onAddReservation({
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequests,
    });
    setSubmittedReservation(res);
  };

  const handleReset = () => {
    setSubmittedReservation(null);
    setName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
  };

  return (
    <section id="reservierung" className="py-16 sm:py-24 bg-[#f5f2eb] border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c2410c] block mb-2">
            Herzlich Willkommen
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
            Tisch reservieren
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
            Sichern Sie sich Ihren Lieblingstisch für einen genussvollen Abend. Größere Gruppen gerne auch telefonisch unter{' '}
            <a
              href={`tel:${restaurantInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="text-[#c2410c] font-semibold underline"
            >
              {restaurantInfo.phone}
            </a>
            .
          </p>
        </div>

        {submittedReservation ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-sm text-center max-w-xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif-display font-bold text-stone-900 mb-2">
              Vielen Dank für Ihre Reservierung!
            </h3>
            <p className="text-stone-600 text-sm mb-6">
              Wir haben Ihre Anfrage für <span className="font-bold">{submittedReservation.guests} Personen</span> am{' '}
              <span className="font-bold">{submittedReservation.date}</span> um{' '}
              <span className="font-bold">{submittedReservation.time} Uhr</span> auf den Namen{' '}
              <span className="font-bold">{submittedReservation.name}</span> erhalten und freuen uns auf Ihren Besuch.
            </p>

            <div className="bg-stone-50 rounded-2xl p-4 text-left text-xs text-stone-600 space-y-1.5 border border-stone-200 mb-6">
              <div className="font-bold text-stone-800 mb-1">Ihre Buchungsdetails:</div>
              <div>• Reservierungs-ID: #{submittedReservation.id.slice(-6)}</div>
              <div>• Telefon: {submittedReservation.phone}</div>
              {submittedReservation.email && <div>• Bestätigungs-E-Mail: {submittedReservation.email}</div>}
              {submittedReservation.specialRequests && (
                <div>• Wünsche: &bdquo;{submittedReservation.specialRequests}&ldquo;</div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-full transition-colors"
            >
              Weitere Reservierung anfragen
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Datum */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Datum *</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
                />
              </div>

              {/* Uhrzeit */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Uhrzeit *</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
                >
                  <option value="12:00">12:00 Uhr (Mittag)</option>
                  <option value="12:30">12:30 Uhr</option>
                  <option value="13:00">13:00 Uhr</option>
                  <option value="13:30">13:30 Uhr</option>
                  <option value="14:00">14:00 Uhr</option>
                  <option value="17:30">17:30 Uhr (Abend)</option>
                  <option value="18:00">18:00 Uhr</option>
                  <option value="18:30">18:30 Uhr</option>
                  <option value="19:00">19:00 Uhr</option>
                  <option value="19:30">19:30 Uhr</option>
                  <option value="20:00">20:00 Uhr</option>
                  <option value="20:30">20:30 Uhr</option>
                  <option value="21:00">21:00 Uhr</option>
                </select>
              </div>

              {/* Anzahl Gäste */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Personen *</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'Personen'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Ihr Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Familie Schmidt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
                />
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Telefonnummer (für Rückfragen) *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+49 170 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
                />
              </div>

              {/* E-Mail */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>E-Mail-Adresse</span>
                </label>
                <input
                  type="email"
                  placeholder="ihre-email@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
                />
              </div>
            </div>

            {/* Besondere Wünsche */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Besondere Wünsche oder Anmerkungen (z.B. Hochstuhl, Allergien, Geburtstag)
              </label>
              <textarea
                rows={2}
                placeholder="Gerne teilen Sie uns vorab mit, falls Sie besondere Wünsche haben..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100">
              <span className="text-xs text-stone-500">
                Kostenlose Stornierung jederzeit telefonisch möglich.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#c2410c] hover:bg-[#9a3412] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Verbindlich anfragen
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

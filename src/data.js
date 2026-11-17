export const WEDDING = {
  bride:'Vidhi', groom:'Yash',
  brideParents:'D/O Smt. Babita & Lt. Sh. Rajesh Kumar',
  groomParents:'S/O Smt. Sumitra Devi & Sh. Tula Ram',
  brideParentsLong:'Daughter of Smt. Babita and Late Shri Rajesh Kumar',
  groomParentsLong:'Son of Smt. Sumitra Devi and Shri Tula Ram',
  dateText:'25 November 2026',
  weekday:'Wednesday',
  venue:'Shri Shyam Farm',
  address:'Sector 102, Dhankot, Gurugram',
  mapsUrl:'https://www.google.com/maps/search/?api=1&query=Shri%20Shyam%20Farm%2C%20Sector%20102%2C%20Dhankot%2C%20Gurugram',
  start:'2026-11-25T00:00:00+05:30'
};
export const CHAPTERS = {
  royal:['The Invitation','An Auspicious Beginning','The Palace Awakens','The Royal Procession','The Bride','The Groom','Two Destinies','The Mandap','Seven Blessings','The Grand Date','Your Arrival'],
  minimal:['A Letter For You','The Seal','Unfolding','Two Names','A Quiet Promise','The Families','The Moment','Twenty-Five','The Invitation','The Place','Until Then'],
  floral:['The First Bloom','Morning Light','The Garden Path','A Thousand Petals','The Bride','The Groom','Love in Full Bloom','The Blooming Mandap','Blessings','The Wedding Day','Meet Us Here']
};
export function daysToWedding(){return Math.max(0,Math.ceil((new Date(WEDDING.start).getTime()-Date.now())/86400000));}
export function calendarFile(){
  const e=(s)=>s.replace(/([,;\\])/g,'\\$1');
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Vidhi Yash//Wedding Invite//EN\r\nBEGIN:VEVENT\r\nUID:vidhi-yash-wedding-20261125@invitation\r\nDTSTAMP:20261117T000000Z\r\nDTSTART;VALUE=DATE:20261125\r\nDTEND;VALUE=DATE:20261126\r\nSUMMARY:${e('Wedding of Vidhi & Yash')}\r\nDESCRIPTION:${e('You are warmly invited to celebrate the wedding of Vidhi and Yash. Ceremony timing to be confirmed.')}\r\nLOCATION:${e(`${WEDDING.venue}, ${WEDDING.address}`)}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
}

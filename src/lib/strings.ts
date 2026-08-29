import type { L10n } from "./types";

/** UI chrome copy. Content copy lives in content/, this is the furniture. */
export const S = {
  siteName: { en: "Thai Foreningen Bergen", no: "Thai Foreningen Bergen", th: "สมาคมคนไทยในเบอร์เกน" },

  nav: {
    courses: { en: "Courses", no: "Kurs", th: "อบรม" },
    help: { en: "Help", no: "Hjelp", th: "ความช่วยเหลือ" },
    activities: { en: "Activities", no: "Aktiviteter", th: "กิจกรรม" },
    about: { en: "About", no: "Om oss", th: "เกี่ยวกับสมาคม" },
    contact: { en: "Contact", no: "Kontakt", th: "ติดต่อ" },
  },

  helpBar: {
    tag: { en: "Urgent help", no: "Akutt hjelp", th: "ช่วยเหลือฉุกเฉิน" },
    interpreter: { en: "We can provide an interpreter", no: "Vi kan stille med tolk", th: "สมาคมจัดล่ามให้ได้" },
  },

  menu: { en: "Menu", no: "Meny", th: "เมนู" },
  close: { en: "Close", no: "Lukk", th: "ปิด" },
  skipToContent: { en: "Skip to content", no: "Hopp til innhold", th: "ข้ามไปยังเนื้อหา" },
  language: { en: "Language", no: "Språk", th: "ภาษา" },

  hero: {
    eyebrow: { en: "Founded in Bergen, 8 January 2010", no: "Stiftet i Bergen 8. januar 2010", th: "ก่อตั้งที่เบอร์เกน 8 มกราคม 2010" },
    lead: {
      en: "We run the food safety courses you need to work in a Norwegian kitchen, and we help Thai people in Bergen deal with the police, lawyers, hospitals and the crisis centre.",
      no: "Vi arrangerer matkursene du trenger for å jobbe på kjøkken i Norge, og vi hjelper thailendere i Bergen med kontakt mot politi, advokat, sykehus og krisesenter.",
      th: "เราจัดคอร์สอบรมความปลอดภัยด้านอาหารที่จำเป็นสำหรับการทำงานในครัวที่นอร์เวย์ และช่วยคนไทยในเบอร์เกนติดต่อตำรวจ ทนาย โรงพยาบาล และศูนย์ช่วยเหลือ",
    },
    primary: { en: "See the courses", no: "Se kursene", th: "ดูคอร์สอบรม" },
    secondary: { en: "Get help", no: "Få hjelp", th: "ขอความช่วยเหลือ" },
    proof: { en: "Volunteer run since 2010", no: "Frivillig drevet siden 2010", th: "ดำเนินงานโดยอาสาสมัครตั้งแต่ปี 2010" },
  },

  courses: {
    label: { en: "Courses and certification", no: "Kurs og sertifisering", th: "อบรมและใบรับรอง" },
    lead: {
      en: "The courses you need to work in a Norwegian kitchen. Taught in Thai and Norwegian.",
      no: "Kursene du trenger for å jobbe på kjøkken i Norge. Undervisning på thai og norsk.",
      th: "คอร์สอบรมที่จำเป็นสำหรับการทำงานในครัวที่นอร์เวย์ สอนเป็นภาษาไทยและนอร์เวย์",
    },
    course: { en: "Course", no: "Kurs", th: "คอร์ส" },
    regulator: { en: "Regulator", no: "Tilsyn", th: "หน่วยงานกำกับ" },
    nextDate: { en: "Next date", no: "Neste dato", th: "รอบถัดไป" },
    price: { en: "Price", no: "Pris", th: "ราคา" },
    register: { en: "Register", no: "Meld deg på", th: "ลงทะเบียน" },
    tbd: { en: "Date to be announced", no: "Dato kommer", th: "รอประกาศวันอบรม" },
    allRegulators: { en: "All courses", no: "Alle kurs", th: "ทุกคอร์ส" },
    filterBy: { en: "Filter by what the inspector asks for", no: "Filtrer etter hva tilsynet spør etter", th: "กรองตามเอกสารที่เจ้าหน้าที่ตรวจสอบขอ" },
    seats: { en: "6 to 8 places per course", no: "6 til 8 plasser per kurs", th: "รับ 6 ถึง 8 คนต่อคอร์ส" },
    noExam: { en: "No written exam", no: "Ingen skriftlig eksamen", th: "ไม่มีการสอบข้อเขียน" },
    certificatePosted: { en: "Certificate posted to you", no: "Kursbevis sendes i posten", th: "ส่งใบรับรองทางไปรษณีย์" },
    hours: { en: "About 5 hours", no: "Cirka 5 timer", th: "ประมาณ 5 ชั่วโมง" },
    whoFor: { en: "Who it is for", no: "Hvem det er for", th: "เหมาะสำหรับใคร" },
    whatYouLearn: { en: "What it covers", no: "Hva det dekker", th: "เนื้อหาที่ครอบคลุม" },
    providerNote: {
      en: "Courses are run by Thai Restaurantvirksomhet Kurs, a separate business from the association. Course fees are paid to that company and are not association funds.",
      no: "Kursene drives av Thai Restaurantvirksomhet Kurs, et eget foretak atskilt fra foreningen. Kursavgiften betales til dette foretaket og er ikke foreningens midler.",
      th: "คอร์สอบรมดำเนินการโดย Thai Restaurantvirksomhet Kurs ซึ่งเป็นกิจการแยกต่างหากจากสมาคม ค่าอบรมชำระให้บริษัทดังกล่าวและไม่ใช่เงินของสมาคม",
    },
    certificateNote: {
      en: "The certificate documents that you completed the training. It is issued by Thai Restaurantvirksomhet Kurs.",
      no: "Kursbeviset dokumenterer at du har gjennomført opplæringen. Det utstedes av Thai Restaurantvirksomhet Kurs.",
      th: "ใบรับรองเป็นเอกสารยืนยันว่าคุณผ่านการอบรมแล้ว ออกโดย Thai Restaurantvirksomhet Kurs",
    },
  },

  help: {
    label: { en: "Help and public services", no: "Hjelp og offentlige tjenester", th: "ความช่วยเหลือและบริการภาครัฐ" },
    lead: {
      en: "We can interpret, explain a letter, and come with you to the meeting. Members are helped first because there are only so many volunteers, but an emergency is answered either way.",
      no: "Vi kan tolke, forklare et brev, og bli med deg i møtet. Medlemmer prioriteres fordi vi er få frivillige, men akutte henvendelser besvares uansett.",
      th: "เราช่วยเป็นล่าม อธิบายจดหมาย และไปประชุมกับคุณได้ สมาชิกได้รับความช่วยเหลือก่อนเพราะเรามีอาสาสมัครจำกัด แต่กรณีฉุกเฉินเราตอบทุกกรณี",
    },
    directory: { en: "Where to go directly", no: "Hvor du går direkte", th: "ติดต่อหน่วยงานโดยตรง" },
    readMore: { en: "Read more", no: "Les mer", th: "อ่านเพิ่มเติม" },
    visitSite: { en: "Go to their website", no: "Gå til nettstedet", th: "ไปที่เว็บไซต์" },
  },

  activities: {
    label: { en: "What we do", no: "Det vi gjør", th: "สิ่งที่เราทำ" },
    lead: {
      en: "Charity work, cultural events and the food festival. Everything here happened, with the date it happened on.",
      no: "Veldedighetsarbeid, kulturarrangementer og matfestivalen. Alt her har skjedd, med datoen det skjedde på.",
      th: "งานการกุศล งานวัฒนธรรม และงานมหกรรมอาหาร ทุกอย่างที่แสดงคือสิ่งที่เกิดขึ้นจริง พร้อมวันที่",
    },
    strands: {
      charity: { en: "Charity and donations", no: "Veldedighet og donasjoner", th: "การกุศลและเงินบริจาค" },
      culture: { en: "Culture", no: "Kultur", th: "วัฒนธรรม" },
      "food-festivals": { en: "Food festivals", no: "Matfestivaler", th: "งานมหกรรมอาหาร" },
    },
    empty: { en: "Nothing published here yet.", no: "Ingenting publisert her ennå.", th: "ยังไม่มีเนื้อหาที่เผยแพร่" },
  },

  about: {
    label: { en: "About the association", no: "Om foreningen", th: "เกี่ยวกับสมาคม" },
    lead: {
      en: "The association exists to help Thai people living in and around Bergen, to keep Thai traditions going here, and to stand between members and the Norwegian system when that system is hard to read.",
      no: "Foreningen finnes for å hjelpe thailendere i og rundt Bergen, for å holde thailandske tradisjoner i live her, og for å stå mellom medlemmene og det norske systemet når det systemet er vanskelig å lese.",
      th: "สมาคมมีขึ้นเพื่อช่วยเหลือคนไทยในเบอร์เกนและพื้นที่ใกล้เคียง รักษาประเพณีไทยไว้ที่นี่ และเป็นตัวกลางระหว่างสมาชิกกับระบบราชการนอร์เวย์เมื่อระบบนั้นเข้าใจยาก",
    },
    founded: { en: "Founded in Bergen", no: "Stiftet i Bergen", th: "ก่อตั้งที่เบอร์เกน" },
    registered: { en: "Registered as an association", no: "Registrert som forening", th: "จดทะเบียนเป็นสมาคม" },
    bylaws: { en: "Bylaws last amended", no: "Vedtekter sist endret", th: "แก้ไขข้อบังคับล่าสุด" },
    readBackground: { en: "Read the full background", no: "Les hele bakgrunnen", th: "อ่านความเป็นมาทั้งหมด" },
  },

  contact: {
    label: { en: "Contact", no: "Kontakt", th: "ติดต่อ" },
    lead: {
      en: "Write or call. If it is urgent, use the crisis number rather than email.",
      no: "Skriv eller ring. Er det akutt, bruk krisenummeret framfor e-post.",
      th: "เขียนหรือโทรหาเราได้ หากเป็นเรื่องด่วน กรุณาใช้เบอร์ฉุกเฉินแทนอีเมล",
    },
    association: { en: "The association", no: "Foreningen", th: "สมาคม" },
    courseProvider: { en: "Courses", no: "Kurs", th: "คอร์สอบรม" },
    email: { en: "Email", no: "E-post", th: "อีเมล" },
    phone: { en: "Phone", no: "Telefon", th: "โทรศัพท์" },
    orgNumber: { en: "Org.nr", no: "Org.nr", th: "เลขทะเบียน" },
    postal: { en: "Postal address", no: "Postadresse", th: "ที่อยู่ทางไปรษณีย์" },
    urgent: { en: "If it is urgent", no: "Hvis det haster", th: "หากเป็นเรื่องด่วน" },
  },

  footer: {
    sections: { en: "Sections", no: "Sider", th: "หมวดหมู่" },
    contact: { en: "Contact", no: "Kontakt", th: "ติดต่อ" },
    support: { en: "Support the association", no: "Støtt foreningen", th: "สนับสนุนสมาคม" },
    membership: { en: "Membership", no: "Medlemskap", th: "สมาชิก" },
    bylaws: { en: "Bylaws", no: "Vedtekter", th: "ข้อบังคับ" },
    finances: { en: "Finances", no: "Økonomi", th: "การเงิน" },
    privacy: { en: "Privacy", no: "Personvern", th: "ความเป็นส่วนตัว" },
    frivilligsentral: { en: "Affiliated with the local frivilligsentral", no: "Tilknyttet den lokale frivilligsentralen", th: "สังกัดศูนย์อาสาสมัครท้องถิ่น" },
    vippsPending: { en: "Vipps is not set up yet. Bank transfer works today.", no: "Vipps er ikke satt opp ennå. Bankoverføring fungerer i dag.", th: "ยังไม่ได้เปิดใช้ Vipps สามารถโอนผ่านธนาคารได้" },
    separateEntity: { en: "Courses are run by a separate company", no: "Kursene drives av et eget foretak", th: "คอร์สอบรมดำเนินการโดยบริษัทแยกต่างหาก" },
  },

  membership: {
    fee: { en: "Membership fee", no: "Medlemskontingent", th: "ค่าสมาชิก" },
    oneTime: { en: "one time, per person or per family", no: "engangsbeløp, per person eller per familie", th: "ชำระครั้งเดียว ต่อคนหรือต่อครอบครัว" },
    members: { en: "members", no: "medlemmer", th: "สมาชิก" },
    asOf: { en: "as of", no: "per", th: "ณ วันที่" },
  },

  common: {
    backTo: { en: "Back to", no: "Tilbake til", th: "กลับไปที่" },
    externalLink: { en: "opens an external site", no: "åpner et eksternt nettsted", th: "เปิดเว็บไซต์ภายนอก" },
  },
} satisfies Record<string, unknown>;

export type UIString = L10n;

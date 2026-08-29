import type { L10n } from "./types";

/** UI chrome copy. Content copy lives in content/, this is the furniture. */
export const S = {
  siteName: { en: "Thai Foreningen Bergen", no: "Thai Foreningen Bergen", th: "สมาคมคนไทยในเบอร์เกน" },

  nav: {
    help: { en: "Help", no: "Hjelp", th: "ความช่วยเหลือ" },
    calendar: { en: "Calendar", no: "Kalender", th: "ปฏิทิน" },
    articles: { en: "Articles", no: "Artikler", th: "บทความ" },
    about: { en: "About", no: "Om oss", th: "เกี่ยวกับสมาคม" },
    courses: { en: "Courses", no: "Kurs", th: "อบรม" },
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

  masthead: {
    identity: {
      en: "A volunteer association for Thai people in Bergen, founded 8 January 2010. Affiliated with the local frivilligsentral.",
      no: "En frivillig forening for thailendere i Bergen, stiftet 8. januar 2010. Tilknyttet den lokale frivilligsentralen.",
      th: "สมาคมอาสาสมัครสำหรับคนไทยในเบอร์เกน ก่อตั้งเมื่อ 8 มกราคม 2010 สังกัดศูนย์อาสาสมัครท้องถิ่น",
    },
    orgNumber: { en: "Organisation number", no: "Organisasjonsnummer", th: "เลขทะเบียนองค์กร" },
    registryLink: {
      en: "opens the entry in the Brønnøysund register",
      no: "åpner oppføringen i Brønnøysundregistrene",
      th: "เปิดข้อมูลในทะเบียน Brønnøysund",
    },
  },

  helpToday: {
    heading: { en: "If you need help today", no: "Hvis du trenger hjelp i dag", th: "หากคุณต้องการความช่วยเหลือวันนี้" },
    lead: {
      en: "You do not have to be a member. You do not have to explain yourself in Norwegian. Tell us in Thai what has happened and we will take it from there.",
      no: "Du trenger ikke være medlem. Du trenger ikke forklare deg på norsk. Fortell oss på thai hva som har skjedd, så tar vi det derfra.",
      th: "คุณไม่จำเป็นต้องเป็นสมาชิก ไม่จำเป็นต้องอธิบายเป็นภาษานอร์เวย์ เล่าให้เราฟังเป็นภาษาไทยว่าเกิดอะไรขึ้น แล้วเราจะดำเนินการต่อ",
    },
    krisesenterFor: {
      en: "Violence, threats, or somewhere safe to sleep tonight",
      no: "Vold, trusler, eller et trygt sted å sove i natt",
      th: "ความรุนแรง การข่มขู่ หรือที่พักที่ปลอดภัยสำหรับคืนนี้",
    },
    krisesenterNote: {
      en: "Free, 24 hours, every day of the year, nights and holidays included. They will get an interpreter.",
      no: "Gratis, døgnåpent, hele året, også netter og helligdager. De skaffer tolk.",
      th: "ไม่มีค่าใช้จ่าย เปิด 24 ชั่วโมง ทุกวันตลอดปี รวมกลางคืนและวันหยุด มีล่ามให้",
    },
    associationFor: {
      en: "A letter from NAV, UDI or Barnevernet, an interpreter, or someone to come with you",
      no: "Brev fra NAV, UDI eller barnevernet, tolk, eller noen som blir med deg",
      th: "จดหมายจาก NAV, UDI หรือหน่วยงานคุ้มครองเด็ก ล่าม หรือคนไปเป็นเพื่อน",
    },
    associationNote: {
      en: "Answered by a volunteer. If nobody picks up, leave a message and someone will call back.",
      no: "Besvares av en frivillig. Får du ikke svar, legg igjen en beskjed så ringer noen tilbake.",
      th: "รับสายโดยอาสาสมัคร หากไม่มีคนรับ ฝากข้อความไว้แล้วจะมีคนโทรกลับ",
    },
    confidentiality: {
      en: "Everyone who takes these calls is bound by taushetsplikt. We keep no written record of who contacts us, and nothing is reported to the board.",
      no: "Alle som tar imot disse henvendelsene har taushetsplikt. Vi fører ingen logg over hvem som kontakter oss, og ingenting rapporteres til styret.",
      th: "ทุกคนที่รับเรื่องเหล่านี้มีหน้าที่รักษาความลับตามกฎหมาย เราไม่เก็บบันทึกว่าใครติดต่อมา และไม่มีการรายงานต่อคณะกรรมการ",
    },
    allServices: { en: "Public services and who to contact", no: "Offentlige tjenester og hvem du kontakter", th: "บริการภาครัฐและผู้ที่ควรติดต่อ" },
  },

  comingUp: {
    heading: { en: "Coming up", no: "Det som kommer", th: "กิจกรรมที่กำลังจะมาถึง" },
    all: { en: "The full calendar", no: "Hele kalenderen", th: "ดูปฏิทินทั้งหมด" },
    empty: {
      en: "Nothing is booked yet. The hall is usually confirmed a few weeks ahead, and it appears here when it is.",
      no: "Ingenting er booket ennå. Lokalet bekreftes som regel noen uker i forveien, og dukker opp her når det er klart.",
      th: "ยังไม่มีการจองสถานที่ โดยปกติจะยืนยันล่วงหน้าไม่กี่สัปดาห์ และจะแสดงที่นี่เมื่อพร้อม",
    },
    detailsFollow: { en: "Place and time follow", no: "Sted og tid kommer", th: "สถานที่และเวลาจะแจ้งภายหลัง" },
  },

  entries: {
    recently: { en: "Recently", no: "Nylig", th: "ล่าสุด" },
    archive: { en: "From the archive", no: "Fra arkivet", th: "จากคลังข้อมูล" },
    all: { en: "All articles", no: "Alle artikler", th: "บทความทั้งหมด" },
    empty: { en: "Nothing published here yet.", no: "Ingenting publisert her ennå.", th: "ยังไม่มีเนื้อหาที่เผยแพร่" },
    fromFacebook: { en: "From Facebook", no: "Fra Facebook", th: "จาก Facebook" },
    fromInstagram: { en: "From Instagram", no: "Fra Instagram", th: "จาก Instagram" },
    notYetIn: {
      en: "Not yet in English, shown in {locale}",
      no: "Ikke oversatt til norsk ennå, vises på {locale}",
      th: "ยังไม่มีฉบับภาษาไทย แสดงเป็น{locale}",
    },
    strands: {
      culture: { en: "Culture", no: "Kultur", th: "วัฒนธรรม" },
      charity: { en: "Charity", no: "Veldedighet", th: "การกุศล" },
      festival: { en: "Festival", no: "Festival", th: "เทศกาล" },
      notice: { en: "Notice", no: "Kunngjøring", th: "ประกาศ" },
    },
  },

  onPaper: {
    heading: { en: "The association on paper", no: "Foreningen på papiret", th: "ข้อมูลทางการของสมาคม" },
    asOf: { en: "as of", no: "per", th: "ณ" },
  },

  join: {
    heading: { en: "Membership, giving and helping", no: "Medlemskap, gaver og frivillige", th: "สมาชิก การบริจาค และอาสาสมัคร" },
    terms: {
      en: "Membership is 50 kroner, once, for one person or for a family. Anyone living in the Bergen area with a connection to Thailand can join, and so can a Norwegian husband, wife or partner. Children under fifteen need a guardian to sign.",
      no: "Medlemskap koster 50 kroner, én gang, for én person eller for en familie. Alle som bor i Bergensområdet og har en tilknytning til Thailand kan bli medlem, og det kan en norsk ektefelle eller partner også. Barn under femten år trenger underskrift fra en foresatt.",
      th: "ค่าสมาชิก 50 โครนเนอร์ ชำระครั้งเดียว ต่อหนึ่งคนหรือหนึ่งครอบครัว ผู้ที่อาศัยในพื้นที่เบอร์เกนและมีความเกี่ยวข้องกับประเทศไทยสมัครได้ รวมถึงคู่สมรสหรือคู่ชีวิตชาวนอร์เวย์ เด็กอายุต่ำกว่าสิบห้าปีต้องมีผู้ปกครองลงนาม",
    },
    notSubscription: {
      en: "It is not a subscription to anything. It is a name on a list, which is how the board knows how many people it speaks for.",
      no: "Det er ikke et abonnement på noe. Det er et navn på en liste, og det er slik styret vet hvor mange det taler for.",
      th: "ไม่ใช่การสมัครรับบริการใด เป็นเพียงรายชื่อในทะเบียน ซึ่งทำให้คณะกรรมการรู้ว่าตนพูดแทนคนกี่คน",
    },
    helping: {
      en: "You do not have to be Thai, or a member, to help. The association needs people who can drive, cook for a festival, or sit with someone through a meeting in Norwegian.",
      no: "Du trenger verken å være thailandsk eller medlem for å hjelpe. Foreningen trenger folk som kan kjøre, lage mat til en festival, eller sitte med noen gjennom et møte på norsk.",
      th: "คุณไม่จำเป็นต้องเป็นคนไทยหรือเป็นสมาชิกจึงจะช่วยได้ สมาคมต้องการคนที่ขับรถได้ ทำอาหารในงานเทศกาลได้ หรือไปนั่งเป็นเพื่อนในการประชุมภาษานอร์เวย์",
    },
    howToJoin: { en: "How to join", no: "Slik blir du medlem", th: "วิธีสมัครสมาชิก" },
    howToHelp: { en: "Contact the board", no: "Kontakt styret", th: "ติดต่อคณะกรรมการ" },
  },

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
    whatItCosts: {
      en: "Every course costs the same and covers the same ground: what an inspection asks you to be able to show.",
      no: "Alle kursene koster det samme og dekker det samme: det et tilsyn ber deg kunne vise fram.",
      th: "ทุกคอร์สราคาเท่ากันและครอบคลุมเรื่องเดียวกัน คือสิ่งที่การตรวจสอบขอให้คุณแสดงได้",
    },
    priceIncludes: {
      en: "every course, materials and certificate included",
      no: "alle kurs, kursmateriell og kursbevis inkludert",
      th: "ทุกคอร์ส รวมเอกสารประกอบและใบรับรอง",
    },
    asksFor: {
      en: "{regulator} asks for this one",
      no: "{regulator} krever dette kurset",
      th: "{regulator} กำหนดให้ต้องมีคอร์สนี้",
    },
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
    rolesForward: {
      en: "These addresses forward to whoever currently holds the role, so a change of board never breaks a contact.",
      no: "Disse adressene går videre til den som til enhver tid har vervet, slik at et styrebytte aldri bryter en kontakt.",
      th: "ที่อยู่อีเมลเหล่านี้ส่งต่อไปยังผู้ที่ดำรงตำแหน่งอยู่ในขณะนั้น การเปลี่ยนคณะกรรมการจึงไม่ทำให้ติดต่อไม่ได้",
    },
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

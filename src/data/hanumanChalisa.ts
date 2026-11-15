/**
 * Authentic Sri Hanuman Chalisa & Traditional Sacred Invocations
 * Written by Goswami Tulsidas
 * Clean Devanagari Hindi and English Transliteration
 */

export interface ChalisaSection {
  id: string;
  type: 'dhyana' | 'doha' | 'chaupai' | 'concluding_doha' | 'jaikara';
  title: string;
  number?: number;
  hindi: string[];
  english: string[];
}

export const DHYANA_SHLOKA: ChalisaSection = {
  id: 'dhyana',
  type: 'dhyana',
  title: 'Dhyana Shloka',
  hindi: [
    'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।',
    'वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
  ],
  english: [
    'Manojavam maruta-tulya-vegam, jitendriyam buddhimatam varishtham.',
    'Vatatmajam vanara-yutha-mukhyam, shri rama dutam sharanam prapadye.',
  ],
};

export const OPENING_DOHAS: ChalisaSection[] = [
  {
    id: 'doha-1',
    type: 'doha',
    title: 'Doha 1',
    number: 1,
    hindi: [
      'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।',
      'बरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥',
    ],
    english: [
      'Shri guru charan saroj raj nija manu mukuru sudhari,',
      'Baranau raghubara bimala jasu jo dayaku phala chari.',
    ],
  },
  {
    id: 'doha-2',
    type: 'doha',
    title: 'Doha 2',
    number: 2,
    hindi: [
      'बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार।',
      'बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार॥',
    ],
    english: [
      'Buddhiheen tanu janike sumirau pavana-kumara,',
      'Bala budhi bidya dehu mohi harahu kalesa bikara.',
    ],
  },
];

export const CHAUPAIS_DATA: string[][] = [
  // 1
  [
    'जय हनुमान ज्ञान गुन सागर।',
    'जय कपीस तिहुँ लोक उजागर॥',
    'Jaya Hanumana gyana guna sagara,',
    'Jaya kapisa tihu loka ujagara.',
  ],
  // 2
  [
    'राम दूत अतुलित बल धामा।',
    'अंजनि-पुत्र पवनसुत नामा॥',
    'Rama doota atulita bala dhama,',
    'Anjani-putra pavanasuta nama.',
  ],
  // 3
  [
    'महाबीर बिक्रम बजरंगी।',
    'कुमति निवार सुमति के संगी॥',
    'Mahabeera bikrama bajarangi,',
    'Kumati nivara sumati ke sangi.',
  ],
  // 4
  [
    'कंचन बरन बिराज सुबेसा।',
    'कानन कुंडल कुंचित केसा॥',
    'Kanchana barana biraja subesa,',
    'Kanana kundala kunchita kesa.',
  ],
  // 5
  [
    'हाथ बज्र औ ध्वजा बिराजै।',
    'काँधे मूँज जनेऊ साजै॥',
    'Hatha bajra au dhwaja birajai,',
    'Kandhe moonja jane-u sajai.',
  ],
  // 6
  [
    'संकर सुवन केसरीनंदन।',
    'तेज प्रताप महा जग बंदन॥',
    'Sankara suvana kesareenandana,',
    'Teja pratapa maha jaga bandana.',
  ],
  // 7
  [
    'बिद्यावान गुनी अति चातुर।',
    'राम काज करिबे को आतुर॥',
    'Bidyavana guni ati chatura,',
    'Rama kaja karibe ko aatura.',
  ],
  // 8
  [
    'प्रभु चरित्र सुनिबे को रसिया।',
    'राम लखन सीता मन बसिया॥',
    'Prabhu charitra sunibe ko rasiya,',
    'Rama lakhana seeta mana basiya.',
  ],
  // 9
  [
    'सूक्ष्म रूप धरि सियहिं दिखावा।',
    'बिकट रूप धरि लंक जरावा॥',
    'Sookshma roopa dhari siyahi dikhava,',
    'Bikata roopa dhari lanka jarava.',
  ],
  // 10
  [
    'भीम रूप धरि असुर सँहारे।',
    'रामचंद्र के काज संवारे॥',
    'Bheema roopa dhari asura sanhare,',
    'Ramachandra ke kaja sanvare.',
  ],
  // 11
  [
    'लाय सजीवन लखन जियाये।',
    'श्रीरघुबीर हरषि उर लाये॥',
    'Laya sajeevana lakhana jiyaye,',
    'Shree raghubira harashi ura laye.',
  ],
  // 12
  [
    'रघुपति कीन्ही बहुत बड़ाई।',
    'तुम मम प्रिय भरतहि सम भाई॥',
    'Raghupati keenhi bahuta badai,',
    'Tuma mama priya bharatahi sama bhai.',
  ],
  // 13
  [
    'सहस बदन तुम्हरो जस गावैं।',
    'अस कहि श्रीपति कंठ लगावैं॥',
    'Sahasa badana tumharo jasa gavain,',
    'Asa kahi shreepati kantha lagavain.',
  ],
  // 14
  [
    'सनकादिक ब्रह्मादि मुनीसा।',
    'नारद सारद सहित अहीसा॥',
    'Sanakadika brahmadika muneesa,',
    'Narada sarada sahita aheesa.',
  ],
  // 15
  [
    'जम कुबेर दिगपाल जहाँ ते।',
    'कबि कोबिद कहि सके कहाँ ते॥',
    'Yama kubera digapala jahan te,',
    'Kabi kobida kahi sake kahan te.',
  ],
  // 16
  [
    'तुम उपकार सुग्रीवहिं कीन्हा।',
    'राम मिलाय राज पद दीन्हा॥',
    'Tuma upakara sugreevahin keenha,',
    'Rama milaya raja pada deenha.',
  ],
  // 17
  [
    'तुम्हरो मंत्र बिभीषन माना।',
    'लंकेस्वर भए सब जग जाना॥',
    'Tumharo mantra bibheeshana mana,',
    'Lankeswara bhae saba jaga jana.',
  ],
  // 18
  [
    'जुग सहस्र जोजन पर भानू।',
    'लील्यो ताहि मधुर फल जानू॥',
    'Juga sahasra jojhana para bhanu,',
    'Leelyo tahi madhura phala janu.',
  ],
  // 19
  [
    'प्रभु मुद्रिका मेलि मुख माहीं।',
    'जलधि लाँघि गये अचरज नाहीं॥',
    'Prabhu mudrika meli mukha maheen,',
    'Jaladhi langhi gaye acharaja naheen.',
  ],
  // 20
  [
    'दुर्गम काज जगत के जेते।',
    'सुगम अनुग्रह तुम्हरे तेते॥',
    'Durgama kaja jagata ke jete,',
    'Sugama anugraha tumhare tete.',
  ],
  // 21
  [
    'राम दुआरे तुम रखवारे।',
    'होत न आज्ञा बिनु पैसारे॥',
    'Rama duare tuma rakhaware,',
    'Hota na agya binu paisare.',
  ],
  // 22
  [
    'सब सुख लहै तुम्हारी सरना।',
    'तुम रच्छक काहू को डर ना॥',
    'Saba sukha lahai tumhari sarana,',
    'Tuma rachhaka kahu ko dara na.',
  ],
  // 23
  [
    'आपन तेज सम्हारो आपै।',
    'तीनों लोक हाँक तें काँपै॥',
    'Aapana teja samharo aapai,',
    'Teenon loka hanka ten kanpai.',
  ],
  // 24
  [
    'भूत पिसाच निकट नहिं आवै।',
    'महाबीर जब नाम सुनावै॥',
    'Bhoota pisacha nikata nahin aavai,',
    'Mahabeera jaba nama sunavai.',
  ],
  // 25
  [
    'नासै रोग हरै सब पीरा।',
    'जपत निरंतर हनुमत बीरा॥',
    'Nasai roga harai saba peera,',
    'Japata nirantara hanumata beera.',
  ],
  // 26
  [
    'संकट तें हनुमान छुड़ावै।',
    'मन क्रम बचन ध्यान जो लावै॥',
    'Sankata ten hanumana chhudavai,',
    'Mana krama bachana dhyana jo lavai.',
  ],
  // 27
  [
    'सब पर राम तपस्वी राजा।',
    'तिन के काज सकल तुम साजा॥',
    'Saba para rama tapaswee raja,',
    'Tina ke kaja sakala tuma saja.',
  ],
  // 28
  [
    'और मनोरथ जो कोई लावै।',
    'सोइ अमित जीवन फल पावै॥',
    'Aura manoratha jo koi lavai,',
    'Soi amita jeevana phala pavai.',
  ],
  // 29
  [
    'चारों जुग परताप तुम्हारा।',
    'है परसिद्ध जगत उजियारा॥',
    'Charon juga paratapa tumhara,',
    'Hai parasiddha jagata ujiyara.',
  ],
  // 30
  [
    'साधु संत के तुम रखवारे।',
    'असुर निकंदन राम दुलारे॥',
    'Sadhu santa ke tuma rakhaware,',
    'Asura nikandana rama dulare.',
  ],
  // 31
  [
    'अष्ट सिद्धि नौ निधि के दाता।',
    'अस बर दीन जानकी माता॥',
    'Ashta siddhi nau nidhi ke data,',
    'Asa bara deena janakee mata.',
  ],
  // 32
  [
    'राम रसायन तुम्हरे पासा।',
    'सदा रहो रघुपति के दासा॥',
    'Rama rasayana tumhare pasa,',
    'Sada raho raghupati ke dasa.',
  ],
  // 33
  [
    'तुम्हरे भजन राम को पावै।',
    'जनम जनम के दुख बिसरावै॥',
    'Tumhare bhajana rama ko pavai,',
    'Janama janama ke dukha bisaravai.',
  ],
  // 34
  [
    'अंत काल रघुबर पुर जाई।',
    'जहाँ जन्म हरि-भक्त कहाई॥',
    'Anta kala raghubara pura jai,',
    'Jahan janma hari-bhakta kahai.',
  ],
  // 35
  [
    'और देवता चित्त न धरई।',
    'हनुमत सेइ सर्ब सुख करई॥',
    'Aura devata chitta na dharai,',
    'Hanumata sei sarba sukha karai.',
  ],
  // 36
  [
    'संकट कटै मिटै सब पीरा।',
    'जो सुमिरै हनुमत बलबीरा॥',
    'Sankata katai mitai saba peera,',
    'Jo sumirai hanumata balabeera.',
  ],
  // 37
  [
    'जै जै जै हनुमान गोसाईं।',
    'कृपा करहु गुरुदेव की नाईं॥',
    'Jai jai jai hanumana gosain,',
    'Kripa karahu gurudeva kee naeen.',
  ],
  // 38
  [
    'जो सत बार पाठ कर कोई।',
    'छूटहि बंदि महा सुख होई॥',
    'Jo sata bara patha kara koi,',
    'Chhootahi bandi maha sukha hoi.',
  ],
  // 39
  [
    'जो यह पढ़ै हनुमान चालीसा।',
    'होय सिद्धि साखी गौरीसा॥',
    'Jo yaha padhai hanumana chalisa,',
    'Hoya siddhi sakhee gaureesa.',
  ],
  // 40
  [
    'तुलसीदास सदा हरि चेरा।',
    'कीजै नाथ हृदय मँह डेरा॥',
    'Tulsidasa sada hari chera,',
    'Keejai natha hridaya manh dera.',
  ],
];

const HINDI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const CHAUPAIS: ChalisaSection[] = CHAUPAIS_DATA.map((item, idx) => {
  const num = idx + 1;
  const hindiNum = String(num)
    .split('')
    .map((d) => HINDI_DIGITS[parseInt(d, 10)])
    .join('');

  // Clean trailing punctuation and properly format with double dandas on BOTH sides: ॥ १ ॥
  const cleanHindiLine2 = item[1].replace(/[।॥\s]+$/, '');
  const hindiLine2 = `${cleanHindiLine2} ॥ ${hindiNum} ॥`;

  // English transliteration ending notation: || 1 ||
  const cleanEngLine2 = item[3].replace(/[.,;\s]+$/, '');
  const englishLine2 = `${cleanEngLine2} || ${num} ||`;

  return {
    id: `chaupai-${num}`,
    type: 'chaupai',
    title: `Chaupai ${num}`,
    number: num,
    hindi: [item[0], hindiLine2],
    english: [item[2], englishLine2],
  };
});

export const CONCLUDING_DOHA: ChalisaSection = {
  id: 'concluding-doha',
  type: 'concluding_doha',
  title: 'Concluding Doha',
  hindi: [
    'पवन तनय संकट हरन मंगल मूरति रूप।',
    'राम लखन सीता सहित हृदय बसहु सुर भूप॥',
  ],
  english: [
    'Pavan tanay sankat haran mangalmurti rup,',
    'Ram lakhan sita sahit hriday basahu sur bhup.',
  ],
};

export const CONCLUDING_JAIKARA: ChalisaSection = {
  id: 'jaikara',
  type: 'jaikara',
  title: 'Sacred Acclamations',
  hindi: [
    'सियावर रामचंद्र की जय!',
    'उमापति महादेव की जय!',
    'पवनसुत हनुमान की जय!',
  ],
  english: [
    'Siyavar Ram Chandra ki Jay!',
    'Uma Pati Mahadev ki Jai!',
    'Pavan Sut Hanuman ki Jay!',
  ],
};

// Full sacred recitation sequence: Dhyana -> Opening Dohas -> 40 Chaupais -> Concluding Doha -> Jaikaras
export const ALL_CHALISA_SECTIONS: ChalisaSection[] = [
  DHYANA_SHLOKA,
  ...OPENING_DOHAS,
  ...CHAUPAIS,
  CONCLUDING_DOHA,
  CONCLUDING_JAIKARA,
];

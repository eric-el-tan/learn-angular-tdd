export class DeptUtil {

static getAllDepartments() {
    return [
        '',
      '9000 - Research Office',
      '9002 - Post Award Support Services',
      '9003 - Income Growth and Research Ana',
      '9004 - Ethics Committees',
      '9005 - CAI - EFR',
      '9006 - Architecture - EFR',
      '9007 - Property - Ext Funded Research',
      '9008 - Planning - EFR',
      '9009 - Public Policy Institute',
      '9010 - Arts Faculty Office',
      '9011 - Anthropology',
      '9012 - Art History',
      '9013 - Asian Studies',
      '9014 - Classics & Ancient History',
      '9015 - Education',
      '9016 - English Drama &Writing Studies',
      '9017 - European Language & Literature',
      '9018 - History',
      '9019 - Māori Studies',
      '9020 - Philosophy',
      '9021 - Politics & Intl Relations',
      '9033 - Music - EFR',
      '9035 - James Henare Māori Research',
      '9037 - FRC New Zealand Asia Institute (NZAI)',
      '9041 - CoRE - Nga Pae - TEC Res Funds',
      '9042 - CoRE - Nga Pae - Oth Res Funds',
      '9050 - Business Faculty Office',
      '9051 - Business Research Centres',
      '9052 - Accounting and Finance',
      '9053 - Commercial Law',
      '9054 - Economics',
      '9055 - Info Systems & Operations Mgmt',
      '9056 - Management and Intl Business',
      '9057 - Marketing',
      '9058 - Graduate School of Management',
      '9060 - School of Social Science_EFR',
      '9061 - School of Humanities_EFR',
      '9062 - Cultures,Lang&Linguistics_EFR',
      '9063 - Te Wananga o Waipapa_EFR',
      '9066 - NICAI-TRI: Transforming Akld',
      '9070 - Engineering Faculty Office',
      '9071 - Chemical & Materials Eng',
      '9072 - Civil & Envirmntal Engineering',
      '9073 - Electrical & Computer Eng',
      '9074 - Mechanical Engineering',
      '9075 - Engineering Science',
      '9077 - Bioengineering Institute',
      '9080 - Fine Arts - EFR',
      '9081 - Ctr for Medical Technologies',
      '9082 - High Value Nutrition',
      '9083 - A Better Start',
      '9085 - Law',
      '9086 - Res Centre for Business Law',
      '9090 - Medicine Faculty Office',
      '9098 - Brain Research New Zealand',
      '9100 - Ad - Misc SOM Research',
      '9101 - Medicine EFR',
      '9102 - Molecular Medicine EFR',
      '9103 - O&G EFR',
      '9104 - Paediatrics EFR',
      '9105 - Res Lab Support-EFR',
      '9107 - Surgery EFR',
      '9108 - South Auckland EFR',
      '9109 - North Shore',
      '9110 - Education Unit FHMS',
      '9111 - Waikato EFR',
      '9112 - Anaesthesiology EFR',
      '9113 - Ophthalmology EFR',
      '9114 - Nat Inst Health Innovation',
      '9115 - Nursing EFR',
      '9116 - Pacific Health',
      '9117 - Pharmacy EFR',
      '9118 - Public Good Grants',
      '9120 - CoRE_NRCGD',
      '9121 - General Practice EFR',
      '9122 - Te Kupenga Hauora Māori (TKHM)',
      '9123 - Psychological Medicine EFR',
      '9124 - Health Systems EFR',
      '9125 - Epidemiology EFR',
      '9126 - Health Psychology',
      '9127 - Social and Community Health',
      '9128 - Ligg_NRCGD Subcontract',
      '9129 - Ligg_NRCGD Asset Depreciation',
      '9130 - Longitudinal Research Centre',
      '9131 - Audiology EFR',
      '9132 - Pharmacology EFR',
      '9133 - CBR EFR',
      '9134 - Physiology EFR',
      '9135 - Anatomy EFR',
      '9136 - ACSRC EFR',
      '9137 - SMS - EFR Admin',
      '9138 - Oncology EFR',
      '9139 - Nutrition EFR',
      '9140 - Science Faculty Office',
      '9141 - Biological Sciences',
      '9142 - Bio Informatics Institute',
      '9143 - Computer Science',
      '9144 - Mathematics',
      '9145 - Statistics',
      '9146 - Chemical Sciences',
      '9147 - Centre 4 Bio Secuty Bio Divers',
      '9150 - Institute of Marine Science',
      '9151 - Optometry & Vision Science',
      '9152 - Physics',
      '9153 - Psychology',
      '9154 - Sport Exercise Science',
      '9155 - IESE',
      '9156 - Environment',
      '9157 - Wine Industry Research Institute',
      '9158 - CoRE_NZ Inst Mathematics Apps',
      '9159 - M Wilkins Ctre - Molec Biodisc',
      '9160 - Light Metals Research Centre',
      '9161 - Theol & Religious Studies',
      '9162 - CLeaR',
      '9163 - VCs Office',
      '9165 - Dan Walls Centre',
      '9166 - E-Research Centre',
      '9167 - Te Punaha Matatini',
      '9170 - Natl eScience Infrastructure',
      '9181 - Learning Develpmt & Prof Pract',
      '9182 - Curriculum & Pedagogy',
      '9183 - Te Puna Wananga',
      '9185 - Critical Studies in Education',
      '9186 - Counsellg, Soc Wk & Human Serv',
      '9191 - FRC Te Rito Toi – The Centre for Arts and Social Transformation (CAST)',
      '9192 - FRC Tāwharau Whakaumu - Centre for Asia Pacific Refugee Studies (CAPRS)',
      '9199 - Research General',
      '9301 - FRC Te Whare Marea Tātari Kaupapa Public Policy (Research) Institute',
      '9302 - FRC Centre for Centre of Methods and Policy Application in the Social Sciences (COMPASS)',
      '9316 - FRC Juncture - Dialogues on Inclusive Capitalism',
      '9346 - FRC Centre for Advanced Materials Manufacturing and Design',
      '9347 - FRC Centre for Automation, Robotics and Engineering (CARES)',
      '9348 - FRC Infrastructure for Community Futures Research Centre (ICFRC)',
      '9349 - FRC Te Pūnaha Ātea – Space Institute',
      '9350 - FRC Transportation Research Centre',
      '9360 - FRC Aotearoa-New Zealand National Eye Centre (ANZ-NEC)',
      '9361 - FRC Centre for Addiction Research',
      '9362 - FRC Eisdell Moore Centre',
      '9363 - FRC Manaaki Manawa – The Centre for Heart Research',
      '9364 - FRC Surgical and Translational Research (STaR) Centre',
      '9365 - FRC Auckland Cancer Society Research Centre (ACSRC)',
      '9366 - FRC He Ara ki Mua (Centre for Longitudinal Research)',
      '9367 - FRC Centre for Medical Imaging',
      '9368 - FRC National Institute for Health Innovation (Research)',
      '9386 - FRC Centre for Computational Evolution',
      '9387 - FRC Centre for Pūtaiao',
      '9388 - FRC Future Food Research Centre  ',
      '9389 - FRC Natural, Artificial and Organisational Intelligence Institute (The NAOInstitute)',
      '9390 - FRC Te Ao Mārama',
      '9422 - Centre for Brain Research',
      '9423 - Centre for Cancer Research',
      '9424 - Centre for Climate, Biodiversity, and Society',
      '9425 - Centre for Co-Created Ageing Research',
      '9426 - Centre for Pacific and Global Health',
      '9427 - Māori and Pacific Housing Research Centre',
      '9428 - James Henare Māori Research Centre',
      '9500 - Consolidated',
      '9505 - CAI FRD',
      '9506 - Architecture',
      '9507 - Property',
      '9508 - Planning',
      '9509 - Anthropology',
      '9510 - Asian Languages & Literature',
      '9511 - Classics & Ancient History',
      '9512 - Art History',
      '9513 - History',
      '9514 - Philosophy',
      '9515 - Education',
      '9516 - English Drama &Writing Studies',
      '9517 - European Language and Literatu',
      '9518 - History',
      '9519 - Māori Studies',
      '9520 - Philosophy',
      '9521 - Politics & Intl Relations',
      '9522 - Sociology',
      '9523 - Archaeological Research',
      '9524 - Media, Film & TV',
      '9526 - Centre for Pacific Studies',
      '9527 - Institute of Linguistics',
      '9528 - Inst for Development Studies',
      '9530 - Law',
      '9533 - Music',
      '9535 - James Henare Māori Research',
      '9537 - NZ/ Asia Institute',
      '9540 - Chemical Sciences',
      '9541 - Physics',
      '9542 - CoRe- Nga Pae',
      '9543 - Asian Studies',
      '9544 - Dance Studies',
      '9545 - Classics and Ancient History',
      '9546 - Appl\'d Lang Studies and Lingui',
      '9549 - Arts Faculty Office',
      '9550 - Student Affairs',
      '9551 - Business Research Centres',
      '9552 - Accounting and Finance',
      '9553 - Commercial Law',
      '9554 - Economics',
      '9555 - Info Systems and Operations Mg',
      '9556 - Management & Intl Business',
      '9557 - Marketing',
      '9558 - International Business',
      '9560 - Business Faculty Office',
      '9561 - Humanities FRDF',
      '9562 - Culture, Lang& Linguistic FRDF',
      '9563 - Te Wananga o Waipapa FRDF',
      '9564 - Social Sciences FRDF',
      '9570 - Engineering Faculty Office',
      '9571 - Chemical and Materials Eng',
      '9572 - Civil & Enviro Engineering',
      '9573 - Electrical & Computer Eng',
      '9574 - Mechanical Engineering',
      '9575 - Engineering Science',
      '9577 - Bioengineering Institute',
      '9580 - Fine Arts',
      '9585 - Law',
      '9592 - SS- Biomed Core Facility',
      '9801 - Medicine Research New',
      '9802 - Molecular Medicine FRDF',
      '9803 - O&G Research New',
      '9804 - Paediatrics Research New',
      '9805 - Lab Support FRDS',
      '9807 - Surgery Research New',
      '9808 - South Auckland Research New',
      '9809 - North Shore',
      '9810 - Education Unit FHMS',
      '9811 - Waikato Research',
      '9812 - Anaesthesiology Research New',
      '9813 - Ophthalmology Research New',
      '9814 - Nat.Inst.for Health Innovation',
      '9815 - Nursing Research',
      '9816 - Māori Pacific Internal Researc',
      '9817 - Pharmacy FRDF',
      '9818 - Liggins Institute',
      '9821 - General Practice',
      '9822 - Māori Health',
      '9823 - Psychological Medicine Researc',
      '9824 - Health Systems Internal Resear',
      '9825 - Epidemiology',
      '9826 - Health Psychology',
      '9827 - Social & Community Intrnal Res',
      '9830 - SMS Internal FRDS',
      '9831 - Audiology Internal Research',
      '9832 - Pharmacology FRDF',
      '9833 - CBR FRDF',
      '9834 - Physiology FRDS',
      '9835 - Anatomyh FRDF',
      '9836 - ACSRC FRDF',
      '9837 - SMS - FRDF',
      '9838 - Oncology FRDF',
      '9839 - Nutrition Internal FRDS',
      '9840 - Science Faculty Office',
      '9841 - Biological Sciences',
      '9843 - Computer Science',
      '9844 - Mathematics',
      '9845 - Statistics',
      '9846 - Chemical Sciences',
      '9850 - Leigh Marine',
      '9851 - Optometry & Vision Science',
      '9852 - Physics',
      '9853 - Psychology',
      '9854 - Sport Exercise Science',
      '9856 - Geology,Geography and Environm',
      '9861 - Theology',
      '9862 - Education FRDF - CLeaR',
      '9863 - VCs Office',
      '9881 - Education FRDF-LRNDVP',
      '9882 - Education FRDF-CURRPD',
      '9883 - Education FRDF-TPW',
      '9885 - Education FRDF-CSE',
      '9886 - Education FRDF-CSH',
      '9899 - FRDF- Research General',
      '9881 - Education FRDF-LRNDVP',
      '9882 - Education FRDF-CURRPD',
      '9883 - Education FRDF-TPW',
      '9885 - Education FRDF-CSE',
      '9886 - Education FRDF-CSH',
      '9899 - FRDF- Research General'
    ]
  }
}
angular.module('serviceModule')
  .factory('CloneData', ['T', function (T) {
    //客户部分的多语言
    var contactbilingual = {
      customer: T.T('CONTACTS.CUSTOMER'),
      colleague: T.T('CONTACTS.COLLEAGUE'),
      sort: T.T('CONTACTS.SORT'),
      filter: T.T('CONTACTS.FILTER'),
      frequentContacts: T.T('CONTACTS.FREQUENT_CONTACTS'),
      linkclass: T.T('CONTACTS.CONTACT_CATEGORY'),//联系人类别
      asscociationCusNum: T.T('CONTACTS.THE_CUSTOMER_CODE'),//所属客户编码
      asscociationCus: T.T('CONTACTS.THE_NAME_OF_THE_CUSTOMER'),//关联客户
      linkRole: T.T('CONTACTS.CONTACT_ROLE'),//联系人角色
      status: T.T('CONTACTS.CONTACT_STATUS'),
      createData: T.T('CONTACTS.CREATE_DATA'),//创建时间
      mail: T.T('CONTACTS.MAIL'),
      mobile: T.T('CONTACTS.MOBILE'),
      off_mobile: T.T('CONTACTS.OFF_PHONE'),//办公电话
      duty: T.T('CONTACTS.CONTACT_DUTY'),
      yourRegion: T.T('CONTACTS.YOUR_REGION'),
      department: T.T('CONTACTS.CONTACT_DEPART'),
      enter: T.T('CONTACTS.PLEASE_ENTER'),
      all_address: T.T('CONTACTS.DETAIL_ADDRESS'),//全部地址
      weChat: T.T('CONTACTS.WeChat'),
      address: T.T('CONTACTS.ADDRESS'),
      detail_address: T.T('CONTACTS.DETAIL_ADDRESS'),//详细地址
      contact_detail: T.T('CONTACTS.CONTACT_DETAIL'),//联系人详情
      more: T.T('MORE'),
      long_press: T.T('CONTACTS.LONG_PRESS_TO_COPY')//长按复制
    };
    //新增部分多语言
    var quick_create = {
      "quicklyAdd": T.T('ADD.QUICKLY_ADD'),
      "addCustomers": T.T("ADD.ADD_CUSTOMERS"),
      "addContact": T.T("ADD.ADD_CONTACTS"),
      "addClue": T.T("ADD.ADD_CLUE"),
      "addBusiness": T.T("ADD.ADD_BUSINESS"),
      "addVisits": T.T("ADD.ADD_VISITS"),
      "addCompetitors": T.T("ADD.ADD_OPPONENT"),
      "SaveContact": T.T("ADD.SAVE_TO_CONTACT"),
      "pleaseSave": T.T("ADD.PLEASE_SAVE_CUSTOMER"),
      "basicInfo": T.T("ADD.BASIC_INFO"),
      "contactType": T.T("ADD.CONTACT_CATEGORY"),
      "status": T.T("ADD.STATUS"),
      "name": T.T("ADD.CONTACT_NAME"),
      "sex": T.T("ADD.CONTACT_SEX"),
      "department": T.T("ADD.CONTACT_DEPART"),
      "duty": T.T("ADD.CONTACT_DUTY"),
      "role": T.T("ADD.CONTACT_Role"),
      "contactInfo": T.T("ADD.CONTACT_INFO"),
      "mobile": T.T("ADD.MOBILE"),
      "mail": T.T("ADD.MAIL"),
      "address": T.T("ADD.ADDRESS"),
      "detaiAddress": T.T("ADD.DETAIL_ADDRESS"),
      "offPhone": T.T("ADD.OFF_PHONE"),
      "weChat": T.T("ADD.WeChat"),
      "zipCode": T.T("ADD.ZIP_CODE"),
      "remark": T.T("ADD.REMARKS"),
      "pleaseEnter": T.T("ADD.PLEASE_ENTER"),
      "pleaseChoose": T.T("ADD.PLEASE_CHOOSE")
    };
    var applicationBilingual = {
      "manage": T.T("APP.APP_MANAGE"),
      "followUp": T.T("APP.APP_FOLLOW_UP"),
      "share": T.T("APP.APP_SHARE"),
      "customer": T.T("APP.APP_CUSTOMER"),
      "contacts": T.T("APP.APP_CONTACTS"),
      "clue": T.T("APP.APP_CLUE"),
      "business": T.T("APP.APP_BUSINESS"),
      "visitPlan": T.T("APP.APP_VISITPLAN"),
      "tenderMana": T.T("APP.APP_TENDER_MANAGEMENT"),
      "buildProjects": T.T("APP.APP_BUILD_PROJECTS"),
      "more": T.T("APP.APP_MORE"),
      "competitors": T.T("APP.APP_COMPETITORS")
    };
  //客户查询多语言
    var customer_find = {
      all_customer:T.T('CUSTOMER_INQUIRIES.ALL_CUSTOMER'),
      my_customer:T.T('CUSTOMER_INQUIRIES.MY_CUSTOMER'),
      add:T.T('CUSTOMER_INQUIRIES.ADD'),
      search:T.T('CUSTOMER_INQUIRIES.SEARCH'),
      filter:T.T('CUSTOMER_INQUIRIES.FILTER'),
      sort:T.T('CUSTOMER_INQUIRIES.SORT'),
      location:T.T('CUSTOMER_INQUIRIES.LOCATION'),
    }
    //客户新增多语言
    var customer_add = {
      create_customer:T.T('CUSTOMER_ADD.CREATE_A_NEW_CUSTOMER'),
      full_name:T.T('CUSTOMER_ADD.FULL_NAME'),
      simple_name:T.T('CUSTOMER_ADD.SIMPLE_NAME'),
      cancel:T.T('CUSTOMER_ADD.CANCEL'),
      confirm:T.T('CUSTOMER_ADD.CONFIRM'),
    }
  // 客户新增完善信息多语言
    var customer_information = {
      improve_information:T.T('IMPROVE_INFORMATION.IMPROVE_INFORMATION'),
      basic_info:T.T('IMPROVE_INFORMATION.BASIC_INFO'),
      hide:T.T('IMPROVE_INFORMATION.HIDE'),
      show:T.T('IMPROVE_INFORMATION.SHOW'),
      full_name:T.T('CUSTOMER_ADD.FULL_NAME'),
      simple_name1:T.T('CUSTOMER_ADD.SIMPLE_NAME'),
      customer_code:T.T('IMPROVE_INFORMATION.CUSTOMER_CODE'),
      english_name:T.T('IMPROVE_INFORMATION.ENGLISH_NAME'),
      simple_name:T.T('IMPROVE_INFORMATION.SIMPLE_CODE'),
      register_id:T.T('IMPROVE_INFORMATION.REGISTER_ID'),
      credit_code:T.T('IMPROVE_INFORMATION.CREDIT_CODE'),
      duty_paragraph:T.T('IMPROVE_INFORMATION.DUTY_PARAGRAPH'),
      parent_customers:T.T('IMPROVE_INFORMATION.PARENT_CUSTOMERS_ID'),
      contact_info:T.T('IMPROVE_INFORMATION.CONTACT_INFO'),
      address_detail:T.T('IMPROVE_INFORMATION.ADDRESS_DETAILS'),
      zip_code:T.T('IMPROVE_INFORMATION.ADDRESS_ZIP_CODE'),
      phone:T.T('IMPROVE_INFORMATION.PHONE'),
      fax:T.T('IMPROVE_INFORMATION.FAX'),
      website:T.T('IMPROVE_INFORMATION.WEBSITE'),
      team:T.T('IMPROVE_INFORMATION.TEAM'),
      belongs_to_the_region:T.T('IMPROVE_INFORMATION.Belongs_to_the_region'),
      long_belong:T.T('IMPROVE_INFORMATION.LONG_BELONG'),
      principal:T.T('IMPROVE_INFORMATION.PRINCIPAL'),
      professional:T.T('IMPROVE_INFORMATION.PROFESSIONAL_WORK'),
      business_detail:T.T('IMPROVE_INFORMATION.BUSINESS_DETAILS'),
      enterprise_nature:T.T('IMPROVE_INFORMATION.ENTERPRISE_NATURE'),
      owned_industry:T.T('IMPROVE_INFORMATION.OWNED_INDUSTRY'),
      major_industry:T.T('IMPROVE_INFORMATION.MAJOR_INDUSTRY'),
      sub_industry:T.T('IMPROVE_INFORMATION.SUB_INDUSTRY'),
      is_listed:T.T('IMPROVE_INFORMATION.IS_LISTED'),
      worker_scale:T.T('IMPROVE_INFORMATION.WORKER_SCALE'),
      income_scale:T.T('IMPROVE_INFORMATION.INCOME_SCALE'),
      current_system_status:T.T('IMPROVE_INFORMATION.Current_system_application_status'),
      it_status_des:T.T('IMPROVE_INFORMATION.IT_STATUS_DES'),
      other:T.T('IMPROVE_INFORMATION.OTHER'),
      other_description:T.T('IMPROVE_INFORMATION.OTHER_DESCRIPTION'),
      data_status:T.T('IMPROVE_INFORMATION.DATA_STATUS'),
      country:T.T('IMPROVE_INFORMATION.COUNTRY'),
      city:T.T('IMPROVE_INFORMATION.CITY'),
      district_county:T.T('IMPROVE_INFORMATION.DISTRICT_COUNTY'),
      province_continent:T.T('IMPROVE_INFORMATION.PROVINCE_CONTINENT'),
      address:T.T('IMPROVE_INFORMATION.ADDRESS'),
    }

    var application_add = {
      add_application:T.T('APPLICATION_ADD.ADD_APPLICATION'),
      product_category:T.T('APPLICATION_ADD.PRODUCT_CATEGORY'),
      product_brand:T.T('APPLICATION_ADD.PRODUCT_BRAND'),
      company:T.T('APPLICATION_ADD.COMPANY'),
      other_instructions:T.T('APPLICATION_ADD.OTHER_INSTRUCTIONS'),
    }

    var cityData=
    {
      "returnCode": "S",
      "returnMsg": "数据获取成功!",
      "address_list": [
      {
        "addressId": 3173,
        "addressName": "襄樊市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3174,
        "addressName": "鄂州市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3175,
        "addressName": "荆门市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3176,
        "addressName": "孝感市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3177,
        "addressName": "荆州市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3178,
        "addressName": "黄冈市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3179,
        "addressName": "咸宁市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3180,
        "addressName": "随州市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3181,
        "addressName": "恩施土家族苗族自治州",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3182,
        "addressName": "神农架",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3183,
        "addressName": "长沙市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3184,
        "addressName": "株洲市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3185,
        "addressName": "湘潭市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3186,
        "addressName": "衡阳市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3187,
        "addressName": "邵阳市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3188,
        "addressName": "岳阳市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3189,
        "addressName": "常德市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3190,
        "addressName": "张家界市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3191,
        "addressName": "益阳市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3192,
        "addressName": "郴州市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3193,
        "addressName": "永州市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3194,
        "addressName": "怀化市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3195,
        "addressName": "娄底市",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3196,
        "addressName": "湘西土家族苗族自治州",
        "type": "CITY",
        "parentAddressId": 2018
      },
      {
        "addressId": 3197,
        "addressName": "广州市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3198,
        "addressName": "韶关市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3199,
        "addressName": "深圳市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3200,
        "addressName": "珠海市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3201,
        "addressName": "汕头市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3202,
        "addressName": "佛山市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3203,
        "addressName": "江门市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3204,
        "addressName": "湛江市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3205,
        "addressName": "茂名市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3206,
        "addressName": "肇庆市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3207,
        "addressName": "惠州市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3208,
        "addressName": "梅州市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3209,
        "addressName": "汕尾市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3210,
        "addressName": "河源市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3211,
        "addressName": "阳江市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3212,
        "addressName": "清远市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3213,
        "addressName": "东莞市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3214,
        "addressName": "中山市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3215,
        "addressName": "潮州市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3216,
        "addressName": "揭阳市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3217,
        "addressName": "云浮市",
        "type": "CITY",
        "parentAddressId": 2019
      },
      {
        "addressId": 3218,
        "addressName": "南宁市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3219,
        "addressName": "柳州市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3220,
        "addressName": "桂林市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3221,
        "addressName": "梧州市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3222,
        "addressName": "北海市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3223,
        "addressName": "防城港市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3224,
        "addressName": "钦州市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3225,
        "addressName": "贵港市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3226,
        "addressName": "玉林市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3227,
        "addressName": "百色市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3228,
        "addressName": "贺州市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3229,
        "addressName": "河池市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3230,
        "addressName": "来宾市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3231,
        "addressName": "崇左市",
        "type": "CITY",
        "parentAddressId": 2020
      },
      {
        "addressId": 3232,
        "addressName": "海口市",
        "type": "CITY",
        "parentAddressId": 2021
      },
      {
        "addressId": 3233,
        "addressName": "三亚市",
        "type": "CITY",
        "parentAddressId": 2021
      },
      {
        "addressId": 3234,
        "addressName": "重庆市",
        "type": "CITY",
        "parentAddressId": 2022
      },
      {
        "addressId": 3235,
        "addressName": "成都市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3236,
        "addressName": "自贡市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3237,
        "addressName": "攀枝花市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3238,
        "addressName": "泸州市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3239,
        "addressName": "德阳市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3240,
        "addressName": "绵阳市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3241,
        "addressName": "广元市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3242,
        "addressName": "遂宁市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3243,
        "addressName": "内江市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3244,
        "addressName": "乐山市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3245,
        "addressName": "南充市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3246,
        "addressName": "眉山市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3247,
        "addressName": "宜宾市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3248,
        "addressName": "广安市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3249,
        "addressName": "达州市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3250,
        "addressName": "雅安市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3251,
        "addressName": "巴中市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3252,
        "addressName": "资阳市",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3253,
        "addressName": "阿坝藏族羌族自治州",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3254,
        "addressName": "甘孜藏族自治州",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3255,
        "addressName": "凉山彝族自治州",
        "type": "CITY",
        "parentAddressId": 2023
      },
      {
        "addressId": 3256,
        "addressName": "贵阳市",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3257,
        "addressName": "六盘水市",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3258,
        "addressName": "遵义市",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3259,
        "addressName": "安顺市",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3260,
        "addressName": "铜仁地区",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3261,
        "addressName": "黔西南布依族苗族自治州",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3262,
        "addressName": "毕节地区",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3263,
        "addressName": "黔东南苗族侗族自治州",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3264,
        "addressName": "黔南布依族苗族自治州",
        "type": "CITY",
        "parentAddressId": 2024
      },
      {
        "addressId": 3265,
        "addressName": "昆明市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3266,
        "addressName": "曲靖市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3267,
        "addressName": "玉溪市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 1001,
        "addressName": "安哥拉",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1002,
        "addressName": "阿富汗",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1003,
        "addressName": "阿尔巴尼亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1004,
        "addressName": "阿尔及利亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1005,
        "addressName": "安道尔共和国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1006,
        "addressName": "安圭拉岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1007,
        "addressName": "安提瓜和巴布达",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1008,
        "addressName": "阿根廷",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1009,
        "addressName": "亚美尼亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1010,
        "addressName": "阿森松",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1011,
        "addressName": "澳大利亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1012,
        "addressName": "奥地利",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1013,
        "addressName": "阿塞拜疆",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1014,
        "addressName": "巴哈马",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1015,
        "addressName": "巴林",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1016,
        "addressName": "孟加拉国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1017,
        "addressName": "巴巴多斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1018,
        "addressName": "白俄罗斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1019,
        "addressName": "比利时",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1020,
        "addressName": "伯利兹",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1021,
        "addressName": "贝宁",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1022,
        "addressName": "百慕大群岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1023,
        "addressName": "玻利维亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1024,
        "addressName": "博茨瓦纳",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1025,
        "addressName": "巴西",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1026,
        "addressName": "文莱",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1027,
        "addressName": "保加利亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1028,
        "addressName": "布基纳法索",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1029,
        "addressName": "缅甸",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1030,
        "addressName": "布隆迪",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1031,
        "addressName": "喀麦隆",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1032,
        "addressName": "加拿大",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1033,
        "addressName": "开曼群岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1034,
        "addressName": "中非共和国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1035,
        "addressName": "乍得",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1036,
        "addressName": "智利",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1037,
        "addressName": "中国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1038,
        "addressName": "哥伦比亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1039,
        "addressName": "刚果",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1040,
        "addressName": "库克群岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1041,
        "addressName": "哥斯达黎加",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1042,
        "addressName": "古巴",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1043,
        "addressName": "塞浦路斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1044,
        "addressName": "捷克",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1045,
        "addressName": "丹麦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1046,
        "addressName": "吉布提",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1047,
        "addressName": "多米尼加共和国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1048,
        "addressName": "厄瓜多尔",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1049,
        "addressName": "埃及",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1050,
        "addressName": "萨尔瓦多",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1051,
        "addressName": "爱沙尼亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1052,
        "addressName": "埃塞俄比亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1053,
        "addressName": "斐济",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1054,
        "addressName": "芬兰",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1055,
        "addressName": "法国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1056,
        "addressName": "法属圭亚那",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1057,
        "addressName": "加蓬",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1058,
        "addressName": "冈比亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1059,
        "addressName": "格鲁吉亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1060,
        "addressName": "德国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1061,
        "addressName": "加纳",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1062,
        "addressName": "直布罗陀",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1063,
        "addressName": "希腊",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1064,
        "addressName": "格林纳达",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1065,
        "addressName": "关岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1066,
        "addressName": "危地马拉",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1067,
        "addressName": "几内亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1068,
        "addressName": "圭亚那",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1069,
        "addressName": "海地",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1070,
        "addressName": "洪都拉斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1071,
        "addressName": "香港",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1072,
        "addressName": "匈牙利",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1073,
        "addressName": "冰岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1074,
        "addressName": "印度",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1075,
        "addressName": "印度尼西亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1076,
        "addressName": "伊朗",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1077,
        "addressName": "伊拉克",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1078,
        "addressName": "爱尔兰",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1079,
        "addressName": "以色列",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1080,
        "addressName": "意大利",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1081,
        "addressName": "科特迪瓦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1082,
        "addressName": "牙买加",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1083,
        "addressName": "日本",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1084,
        "addressName": "约旦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1085,
        "addressName": "柬埔寨",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1086,
        "addressName": "哈萨克斯坦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1087,
        "addressName": "肯尼亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1088,
        "addressName": "韩国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1089,
        "addressName": "科威特",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1090,
        "addressName": "吉尔吉斯坦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1091,
        "addressName": "老挝",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1092,
        "addressName": "拉脱维亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1093,
        "addressName": "黎巴嫩",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1094,
        "addressName": "莱索托",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1095,
        "addressName": "利比里亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1096,
        "addressName": "利比亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1097,
        "addressName": "列支敦士登",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1098,
        "addressName": "立陶宛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1099,
        "addressName": "卢森堡",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1100,
        "addressName": "澳门",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1101,
        "addressName": "马达加斯加",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1102,
        "addressName": "马拉维",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1103,
        "addressName": "马来西亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1104,
        "addressName": "马尔代夫",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1105,
        "addressName": "马里",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1106,
        "addressName": "马耳他",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1107,
        "addressName": "马里亚那群岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1108,
        "addressName": "马提尼克",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1109,
        "addressName": "毛里求斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1110,
        "addressName": "墨西哥",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1111,
        "addressName": "摩尔多瓦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1112,
        "addressName": "摩纳哥",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1113,
        "addressName": "蒙古",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1114,
        "addressName": "蒙特塞拉特岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1115,
        "addressName": "摩洛哥",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1116,
        "addressName": "莫桑比克",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1117,
        "addressName": "纳米比亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1118,
        "addressName": "瑙鲁",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1119,
        "addressName": "尼泊尔",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1120,
        "addressName": "荷属安的列斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1121,
        "addressName": "荷兰",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1122,
        "addressName": "新西兰",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1123,
        "addressName": "尼加拉瓜",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1124,
        "addressName": "尼日尔",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1125,
        "addressName": "尼日利亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1126,
        "addressName": "朝鲜",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1127,
        "addressName": "挪威",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1128,
        "addressName": "阿曼",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1129,
        "addressName": "巴基斯坦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1130,
        "addressName": "巴拿马",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1131,
        "addressName": "巴布亚新几内亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1132,
        "addressName": "巴拉圭",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1133,
        "addressName": "秘鲁",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1134,
        "addressName": "菲律宾",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1135,
        "addressName": "波兰",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1136,
        "addressName": "法属玻利尼西亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1137,
        "addressName": "葡萄牙",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1138,
        "addressName": "波多黎各",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1139,
        "addressName": "卡塔尔",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1140,
        "addressName": "留尼旺",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1141,
        "addressName": "罗马尼亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1142,
        "addressName": "俄罗斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1144,
        "addressName": "圣文森特岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1145,
        "addressName": "东萨摩亚(美)",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1146,
        "addressName": "西萨摩亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1147,
        "addressName": "圣马力诺",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1148,
        "addressName": "圣多美和普林西比",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1149,
        "addressName": "沙特阿拉伯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1150,
        "addressName": "塞内加尔",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1151,
        "addressName": "塞舌尔",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1152,
        "addressName": "塞拉利昂",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1153,
        "addressName": "新加坡",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1154,
        "addressName": "斯洛伐克",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1155,
        "addressName": "斯洛文尼亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1156,
        "addressName": "所罗门群岛",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1157,
        "addressName": "索马里",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1158,
        "addressName": "南非",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1159,
        "addressName": "西班牙",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1160,
        "addressName": "斯里兰卡",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1161,
        "addressName": "圣卢西亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1162,
        "addressName": "圣文森特",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1163,
        "addressName": "苏丹",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1164,
        "addressName": "苏里南",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1165,
        "addressName": "斯威士兰",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1166,
        "addressName": "瑞典",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1167,
        "addressName": "瑞士",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1168,
        "addressName": "叙利亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1169,
        "addressName": "台湾省",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1170,
        "addressName": "塔吉克斯坦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1171,
        "addressName": "坦桑尼亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1172,
        "addressName": "泰国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1173,
        "addressName": "多哥",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1174,
        "addressName": "汤加",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1175,
        "addressName": "特立尼达和多巴哥",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1176,
        "addressName": "突尼斯",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1177,
        "addressName": "土耳其",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1178,
        "addressName": "土库曼斯坦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1179,
        "addressName": "乌干达",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1180,
        "addressName": "乌克兰",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1181,
        "addressName": "阿拉伯联合酋长国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1182,
        "addressName": "英国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1183,
        "addressName": "美国",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1184,
        "addressName": "乌拉圭",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1185,
        "addressName": "乌兹别克斯坦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1186,
        "addressName": "委内瑞拉",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1187,
        "addressName": "越南",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1188,
        "addressName": "也门",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1189,
        "addressName": "南斯拉夫",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1190,
        "addressName": "津巴布韦",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1191,
        "addressName": "扎伊尔",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 1192,
        "addressName": "赞比亚",
        "type": "COUNTRY",
        "parentAddressId": 0
      },
      {
        "addressId": 2001,
        "addressName": "北京市",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2002,
        "addressName": "天津市",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2003,
        "addressName": "河北省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2004,
        "addressName": "山西省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2005,
        "addressName": "内蒙古自治区",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2006,
        "addressName": "辽宁省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2007,
        "addressName": "吉林省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2008,
        "addressName": "黑龙江省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2009,
        "addressName": "上海市",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2010,
        "addressName": "江苏省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2011,
        "addressName": "浙江省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2012,
        "addressName": "安徽省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2013,
        "addressName": "福建省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2014,
        "addressName": "江西省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2015,
        "addressName": "山东省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2016,
        "addressName": "河南省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2017,
        "addressName": "湖北省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2018,
        "addressName": "湖南省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2019,
        "addressName": "广东省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2020,
        "addressName": "广西壮族自治区",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2021,
        "addressName": "海南省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2022,
        "addressName": "重庆市",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2023,
        "addressName": "四川省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2024,
        "addressName": "贵州省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2025,
        "addressName": "云南省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2026,
        "addressName": "西藏自治区",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2027,
        "addressName": "陕西省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2028,
        "addressName": "甘肃省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2029,
        "addressName": "青海省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2030,
        "addressName": "宁夏回族自治区",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2031,
        "addressName": "新疆维吾尔自治区",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2032,
        "addressName": "香港特别行政区",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2033,
        "addressName": "澳门特别行政区",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 2034,
        "addressName": "台湾省",
        "type": "PROVINCE",
        "parentAddressId": 1037
      },
      {
        "addressId": 3001,
        "addressName": "北京市",
        "type": "CITY",
        "parentAddressId": 2001
      },
      {
        "addressId": 3002,
        "addressName": "天津市",
        "type": "CITY",
        "parentAddressId": 2002
      },
      {
        "addressId": 3003,
        "addressName": "石家庄市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3004,
        "addressName": "唐山市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3005,
        "addressName": "秦皇岛市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3006,
        "addressName": "邯郸市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3007,
        "addressName": "邢台市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3008,
        "addressName": "保定市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3009,
        "addressName": "张家口市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3010,
        "addressName": "承德市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3011,
        "addressName": "沧州市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3012,
        "addressName": "廊坊市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3013,
        "addressName": "衡水市",
        "type": "CITY",
        "parentAddressId": 2003
      },
      {
        "addressId": 3014,
        "addressName": "太原市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3015,
        "addressName": "大同市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3016,
        "addressName": "阳泉市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3017,
        "addressName": "长治市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3018,
        "addressName": "晋城市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3019,
        "addressName": "朔州市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3020,
        "addressName": "晋中市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3021,
        "addressName": "运城市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3022,
        "addressName": "忻州市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3023,
        "addressName": "临汾市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3024,
        "addressName": "吕梁市",
        "type": "CITY",
        "parentAddressId": 2004
      },
      {
        "addressId": 3025,
        "addressName": "呼和浩特市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3026,
        "addressName": "包头市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3027,
        "addressName": "乌海市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3028,
        "addressName": "赤峰市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3029,
        "addressName": "通辽市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3030,
        "addressName": "鄂尔多斯市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3031,
        "addressName": "呼伦贝尔市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3032,
        "addressName": "巴彦淖尔市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3033,
        "addressName": "乌兰察布市",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3034,
        "addressName": "兴安盟",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3035,
        "addressName": "锡林郭勒盟",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3036,
        "addressName": "阿拉善盟",
        "type": "CITY",
        "parentAddressId": 2005
      },
      {
        "addressId": 3037,
        "addressName": "沈阳市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3038,
        "addressName": "大连市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3039,
        "addressName": "鞍山市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3040,
        "addressName": "抚顺市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3041,
        "addressName": "本溪市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3042,
        "addressName": "丹东市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3043,
        "addressName": "锦州市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3044,
        "addressName": "营口市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3045,
        "addressName": "阜新市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3046,
        "addressName": "辽阳市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3047,
        "addressName": "盘锦市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3048,
        "addressName": "铁岭市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3049,
        "addressName": "朝阳市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3050,
        "addressName": "葫芦岛市",
        "type": "CITY",
        "parentAddressId": 2006
      },
      {
        "addressId": 3051,
        "addressName": "长春市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3052,
        "addressName": "吉林市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3053,
        "addressName": "四平市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3054,
        "addressName": "辽源市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3055,
        "addressName": "通化市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3056,
        "addressName": "白山市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3057,
        "addressName": "松原市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3058,
        "addressName": "白城市",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3059,
        "addressName": "延边朝鲜族自治州",
        "type": "CITY",
        "parentAddressId": 2007
      },
      {
        "addressId": 3060,
        "addressName": "哈尔滨市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3061,
        "addressName": "齐齐哈尔市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3062,
        "addressName": "鸡西市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3063,
        "addressName": "鹤岗市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3064,
        "addressName": "双鸭山市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3065,
        "addressName": "大庆市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3066,
        "addressName": "伊春市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3067,
        "addressName": "佳木斯市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3068,
        "addressName": "七台河市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3069,
        "addressName": "牡丹江市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3070,
        "addressName": "黑河市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3071,
        "addressName": "绥化市",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3072,
        "addressName": "大兴安岭地区",
        "type": "CITY",
        "parentAddressId": 2008
      },
      {
        "addressId": 3073,
        "addressName": "上海市",
        "type": "CITY",
        "parentAddressId": 2009
      },
      {
        "addressId": 3074,
        "addressName": "南京市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3075,
        "addressName": "无锡市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3076,
        "addressName": "徐州市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3077,
        "addressName": "常州市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3078,
        "addressName": "苏州市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3079,
        "addressName": "南通市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3080,
        "addressName": "连云港市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3081,
        "addressName": "淮安市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3082,
        "addressName": "盐城市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3083,
        "addressName": "扬州市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3084,
        "addressName": "镇江市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3085,
        "addressName": "泰州市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3086,
        "addressName": "宿迁市",
        "type": "CITY",
        "parentAddressId": 2010
      },
      {
        "addressId": 3087,
        "addressName": "杭州市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3088,
        "addressName": "宁波市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3089,
        "addressName": "温州市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3090,
        "addressName": "嘉兴市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3091,
        "addressName": "湖州市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3092,
        "addressName": "绍兴市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3093,
        "addressName": "金华市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3094,
        "addressName": "衢州市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3095,
        "addressName": "舟山市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3096,
        "addressName": "台州市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3097,
        "addressName": "丽水市",
        "type": "CITY",
        "parentAddressId": 2011
      },
      {
        "addressId": 3098,
        "addressName": "合肥市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3099,
        "addressName": "芜湖市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3100,
        "addressName": "蚌埠市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3101,
        "addressName": "淮南市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3102,
        "addressName": "马鞍山市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3103,
        "addressName": "淮北市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3104,
        "addressName": "铜陵市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3105,
        "addressName": "安庆市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3106,
        "addressName": "黄山市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3107,
        "addressName": "滁州市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3108,
        "addressName": "阜阳市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3109,
        "addressName": "宿州市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3110,
        "addressName": "巢湖市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3111,
        "addressName": "六安市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3112,
        "addressName": "亳州市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3113,
        "addressName": "池州市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3114,
        "addressName": "宣城市",
        "type": "CITY",
        "parentAddressId": 2012
      },
      {
        "addressId": 3115,
        "addressName": "福州市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3116,
        "addressName": "厦门市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3117,
        "addressName": "莆田市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3118,
        "addressName": "三明市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3119,
        "addressName": "泉州市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3120,
        "addressName": "漳州市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3121,
        "addressName": "南平市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3122,
        "addressName": "龙岩市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3123,
        "addressName": "宁德市",
        "type": "CITY",
        "parentAddressId": 2013
      },
      {
        "addressId": 3124,
        "addressName": "南昌市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3125,
        "addressName": "景德镇市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3126,
        "addressName": "萍乡市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3127,
        "addressName": "九江市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3128,
        "addressName": "新余市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3129,
        "addressName": "鹰潭市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3130,
        "addressName": "赣州市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3131,
        "addressName": "吉安市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3132,
        "addressName": "宜春市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3133,
        "addressName": "抚州市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3134,
        "addressName": "上饶市",
        "type": "CITY",
        "parentAddressId": 2014
      },
      {
        "addressId": 3135,
        "addressName": "济南市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3136,
        "addressName": "青岛市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3137,
        "addressName": "淄博市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3138,
        "addressName": "枣庄市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3139,
        "addressName": "东营市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3140,
        "addressName": "烟台市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3141,
        "addressName": "潍坊市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3142,
        "addressName": "济宁市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3143,
        "addressName": "泰安市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3144,
        "addressName": "威海市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3145,
        "addressName": "日照市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3146,
        "addressName": "莱芜市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3147,
        "addressName": "临沂市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3148,
        "addressName": "德州市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3149,
        "addressName": "聊城市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3150,
        "addressName": "滨州市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3151,
        "addressName": "荷泽市",
        "type": "CITY",
        "parentAddressId": 2015
      },
      {
        "addressId": 3152,
        "addressName": "郑州市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3153,
        "addressName": "开封市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3154,
        "addressName": "洛阳市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3155,
        "addressName": "平顶山市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3156,
        "addressName": "安阳市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3157,
        "addressName": "鹤壁市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3158,
        "addressName": "新乡市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3159,
        "addressName": "焦作市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3160,
        "addressName": "濮阳市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3161,
        "addressName": "许昌市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3162,
        "addressName": "漯河市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3163,
        "addressName": "三门峡市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3164,
        "addressName": "南阳市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3165,
        "addressName": "商丘市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3166,
        "addressName": "信阳市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3167,
        "addressName": "周口市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3168,
        "addressName": "驻马店市",
        "type": "CITY",
        "parentAddressId": 2016
      },
      {
        "addressId": 3169,
        "addressName": "武汉市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3170,
        "addressName": "黄石市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3171,
        "addressName": "十堰市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 3172,
        "addressName": "宜昌市",
        "type": "CITY",
        "parentAddressId": 2017
      },
      {
        "addressId": 4640,
        "addressName": "绥滨县",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4641,
        "addressName": "尖山区",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4642,
        "addressName": "岭东区",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4643,
        "addressName": "四方台区",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4644,
        "addressName": "宝山区",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4645,
        "addressName": "集贤县",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4646,
        "addressName": "友谊县",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4647,
        "addressName": "宝清县",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4648,
        "addressName": "饶河县",
        "type": "AREA",
        "parentAddressId": 3064
      },
      {
        "addressId": 4649,
        "addressName": "萨尔图区",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4650,
        "addressName": "龙凤区",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4651,
        "addressName": "让胡路区",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4652,
        "addressName": "红岗区",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4653,
        "addressName": "大同区",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4654,
        "addressName": "肇州县",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4655,
        "addressName": "肇源县",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4656,
        "addressName": "林甸县",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4657,
        "addressName": "杜尔伯特蒙古族自治县",
        "type": "AREA",
        "parentAddressId": 3065
      },
      {
        "addressId": 4658,
        "addressName": "伊春区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4659,
        "addressName": "南岔区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4660,
        "addressName": "友好区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4661,
        "addressName": "西林区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4662,
        "addressName": "翠峦区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4663,
        "addressName": "新青区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4664,
        "addressName": "美溪区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4665,
        "addressName": "金山屯区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4666,
        "addressName": "五营区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4667,
        "addressName": "乌马河区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4668,
        "addressName": "汤旺河区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4669,
        "addressName": "带岭区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4670,
        "addressName": "乌伊岭区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4671,
        "addressName": "红星区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4672,
        "addressName": "上甘岭区",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4673,
        "addressName": "嘉荫县",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4674,
        "addressName": "铁力市",
        "type": "AREA",
        "parentAddressId": 3066
      },
      {
        "addressId": 4675,
        "addressName": "永红区",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4676,
        "addressName": "向阳区",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4677,
        "addressName": "前进区",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4678,
        "addressName": "东风区",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4679,
        "addressName": "郊区",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4680,
        "addressName": "桦南县",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4681,
        "addressName": "桦川县",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4682,
        "addressName": "汤原县",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4683,
        "addressName": "抚远县",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4684,
        "addressName": "同江市",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4685,
        "addressName": "富锦市",
        "type": "AREA",
        "parentAddressId": 3067
      },
      {
        "addressId": 4686,
        "addressName": "新兴区",
        "type": "AREA",
        "parentAddressId": 3068
      },
      {
        "addressId": 4687,
        "addressName": "桃山区",
        "type": "AREA",
        "parentAddressId": 3068
      },
      {
        "addressId": 4688,
        "addressName": "茄子河区",
        "type": "AREA",
        "parentAddressId": 3068
      },
      {
        "addressId": 4689,
        "addressName": "勃利县",
        "type": "AREA",
        "parentAddressId": 3068
      },
      {
        "addressId": 4690,
        "addressName": "东安区",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4691,
        "addressName": "阳明区",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4692,
        "addressName": "爱民区",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4693,
        "addressName": "西安区",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4694,
        "addressName": "东宁县",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4695,
        "addressName": "林口县",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4696,
        "addressName": "绥芬河市",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4697,
        "addressName": "海林市",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4698,
        "addressName": "宁安市",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4699,
        "addressName": "穆棱市",
        "type": "AREA",
        "parentAddressId": 3069
      },
      {
        "addressId": 4700,
        "addressName": "爱辉区",
        "type": "AREA",
        "parentAddressId": 3070
      },
      {
        "addressId": 4701,
        "addressName": "嫩江县",
        "type": "AREA",
        "parentAddressId": 3070
      },
      {
        "addressId": 4702,
        "addressName": "逊克县",
        "type": "AREA",
        "parentAddressId": 3070
      },
      {
        "addressId": 4703,
        "addressName": "孙吴县",
        "type": "AREA",
        "parentAddressId": 3070
      },
      {
        "addressId": 4704,
        "addressName": "北安市",
        "type": "AREA",
        "parentAddressId": 3070
      },
      {
        "addressId": 4705,
        "addressName": "五大连池市",
        "type": "AREA",
        "parentAddressId": 3070
      },
      {
        "addressId": 4706,
        "addressName": "北林区",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4707,
        "addressName": "望奎县",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4708,
        "addressName": "兰西县",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4709,
        "addressName": "青冈县",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4710,
        "addressName": "庆安县",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4711,
        "addressName": "明水县",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4712,
        "addressName": "绥棱县",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4713,
        "addressName": "安达市",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4714,
        "addressName": "肇东市",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4715,
        "addressName": "海伦市",
        "type": "AREA",
        "parentAddressId": 3071
      },
      {
        "addressId": 4716,
        "addressName": "呼玛县",
        "type": "AREA",
        "parentAddressId": 3072
      },
      {
        "addressId": 4717,
        "addressName": "塔河县",
        "type": "AREA",
        "parentAddressId": 3072
      },
      {
        "addressId": 4718,
        "addressName": "漠河县",
        "type": "AREA",
        "parentAddressId": 3072
      },
      {
        "addressId": 4719,
        "addressName": "黄浦区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4720,
        "addressName": "卢湾区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4721,
        "addressName": "徐汇区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4722,
        "addressName": "长宁区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4723,
        "addressName": "静安区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4724,
        "addressName": "普陀区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4725,
        "addressName": "闸北区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4726,
        "addressName": "虹口区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4727,
        "addressName": "杨浦区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4728,
        "addressName": "闵行区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4729,
        "addressName": "宝山区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4730,
        "addressName": "嘉定区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4731,
        "addressName": "浦东新区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4732,
        "addressName": "金山区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4733,
        "addressName": "松江区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4734,
        "addressName": "青浦区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4735,
        "addressName": "南汇区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4736,
        "addressName": "奉贤区",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4737,
        "addressName": "崇明县",
        "type": "AREA",
        "parentAddressId": 3073
      },
      {
        "addressId": 4738,
        "addressName": "玄武区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4739,
        "addressName": "白下区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4740,
        "addressName": "秦淮区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4741,
        "addressName": "建邺区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4742,
        "addressName": "鼓楼区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4743,
        "addressName": "下关区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4744,
        "addressName": "浦口区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 3268,
        "addressName": "保山市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3269,
        "addressName": "昭通市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3270,
        "addressName": "丽江市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3271,
        "addressName": "思茅市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3272,
        "addressName": "临沧市",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3273,
        "addressName": "楚雄彝族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3274,
        "addressName": "红河哈尼族彝族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3275,
        "addressName": "文山壮族苗族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3276,
        "addressName": "西双版纳傣族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3277,
        "addressName": "大理白族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3278,
        "addressName": "德宏傣族景颇族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3279,
        "addressName": "怒江傈僳族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3280,
        "addressName": "迪庆藏族自治州",
        "type": "CITY",
        "parentAddressId": 2025
      },
      {
        "addressId": 3281,
        "addressName": "拉萨市",
        "type": "CITY",
        "parentAddressId": 2026
      },
      {
        "addressId": 3282,
        "addressName": "昌都地区",
        "type": "CITY",
        "parentAddressId": 2026
      },
      {
        "addressId": 3283,
        "addressName": "山南地区",
        "type": "CITY",
        "parentAddressId": 2026
      },
      {
        "addressId": 3284,
        "addressName": "日喀则地区",
        "type": "CITY",
        "parentAddressId": 2026
      },
      {
        "addressId": 3285,
        "addressName": "那曲地区",
        "type": "CITY",
        "parentAddressId": 2026
      },
      {
        "addressId": 3286,
        "addressName": "阿里地区",
        "type": "CITY",
        "parentAddressId": 2026
      },
      {
        "addressId": 3287,
        "addressName": "林芝地区",
        "type": "CITY",
        "parentAddressId": 2026
      },
      {
        "addressId": 3288,
        "addressName": "西安市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3289,
        "addressName": "铜川市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3290,
        "addressName": "宝鸡市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3291,
        "addressName": "咸阳市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3292,
        "addressName": "渭南市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3293,
        "addressName": "延安市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3294,
        "addressName": "汉中市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3295,
        "addressName": "榆林市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3296,
        "addressName": "安康市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3297,
        "addressName": "商洛市",
        "type": "CITY",
        "parentAddressId": 2027
      },
      {
        "addressId": 3298,
        "addressName": "兰州市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3299,
        "addressName": "嘉峪关市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3300,
        "addressName": "金昌市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3301,
        "addressName": "白银市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3302,
        "addressName": "天水市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3303,
        "addressName": "武威市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3304,
        "addressName": "张掖市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3305,
        "addressName": "平凉市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3306,
        "addressName": "酒泉市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3307,
        "addressName": "庆阳市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3308,
        "addressName": "定西市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3309,
        "addressName": "陇南市",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3310,
        "addressName": "临夏回族自治州",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3311,
        "addressName": "甘南藏族自治州",
        "type": "CITY",
        "parentAddressId": 2028
      },
      {
        "addressId": 3312,
        "addressName": "西宁市",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3313,
        "addressName": "海东地区",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3314,
        "addressName": "海北藏族自治州",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3315,
        "addressName": "黄南藏族自治州",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3316,
        "addressName": "海南藏族自治州",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3317,
        "addressName": "果洛藏族自治州",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3318,
        "addressName": "玉树藏族自治州",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3319,
        "addressName": "海西蒙古族藏族自治州",
        "type": "CITY",
        "parentAddressId": 2029
      },
      {
        "addressId": 3320,
        "addressName": "银川市",
        "type": "CITY",
        "parentAddressId": 2030
      },
      {
        "addressId": 3321,
        "addressName": "石嘴山市",
        "type": "CITY",
        "parentAddressId": 2030
      },
      {
        "addressId": 3322,
        "addressName": "吴忠市",
        "type": "CITY",
        "parentAddressId": 2030
      },
      {
        "addressId": 3323,
        "addressName": "固原市",
        "type": "CITY",
        "parentAddressId": 2030
      },
      {
        "addressId": 3324,
        "addressName": "中卫市",
        "type": "CITY",
        "parentAddressId": 2030
      },
      {
        "addressId": 3325,
        "addressName": "乌鲁木齐市",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3326,
        "addressName": "克拉玛依市",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3327,
        "addressName": "吐鲁番地区",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3328,
        "addressName": "哈密地区",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3329,
        "addressName": "昌吉回族自治州",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3330,
        "addressName": "博尔塔拉蒙古自治州",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3331,
        "addressName": "巴音郭楞蒙古自治州",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3332,
        "addressName": "阿克苏地区",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3333,
        "addressName": "克孜勒苏柯尔克孜自治州",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3334,
        "addressName": "喀什地区",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3335,
        "addressName": "和田地区",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3336,
        "addressName": "伊犁哈萨克自治州",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3337,
        "addressName": "塔城地区",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3338,
        "addressName": "阿勒泰地区",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3339,
        "addressName": "石河子市",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3340,
        "addressName": "阿拉尔市",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3341,
        "addressName": "图木舒克市",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3342,
        "addressName": "五家渠市",
        "type": "CITY",
        "parentAddressId": 2031
      },
      {
        "addressId": 3343,
        "addressName": "香港特别行政区",
        "type": "CITY",
        "parentAddressId": 2032
      },
      {
        "addressId": 3344,
        "addressName": "澳门特别行政区",
        "type": "CITY",
        "parentAddressId": 2033
      },
      {
        "addressId": 4001,
        "addressName": "东城区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4002,
        "addressName": "西城区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4003,
        "addressName": "崇文区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4004,
        "addressName": "宣武区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4005,
        "addressName": "朝阳区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4006,
        "addressName": "丰台区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4007,
        "addressName": "石景山区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4008,
        "addressName": "海淀区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4009,
        "addressName": "门头沟区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4010,
        "addressName": "房山区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4011,
        "addressName": "通州区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4012,
        "addressName": "顺义区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4013,
        "addressName": "昌平区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4014,
        "addressName": "大兴区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4015,
        "addressName": "怀柔区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4016,
        "addressName": "平谷区",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4017,
        "addressName": "密云县",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4018,
        "addressName": "延庆县",
        "type": "AREA",
        "parentAddressId": 3001
      },
      {
        "addressId": 4019,
        "addressName": "和平区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4020,
        "addressName": "河东区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4021,
        "addressName": "河西区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4022,
        "addressName": "南开区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4023,
        "addressName": "河北区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4024,
        "addressName": "红桥区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4025,
        "addressName": "塘沽区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4026,
        "addressName": "汉沽区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4027,
        "addressName": "大港区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4028,
        "addressName": "东丽区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4029,
        "addressName": "西青区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4030,
        "addressName": "津南区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4031,
        "addressName": "北辰区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4032,
        "addressName": "武清区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4033,
        "addressName": "宝坻区",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4034,
        "addressName": "宁河县",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4035,
        "addressName": "静海县",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4036,
        "addressName": "蓟县",
        "type": "AREA",
        "parentAddressId": 3002
      },
      {
        "addressId": 4037,
        "addressName": "长安区",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4038,
        "addressName": "桥东区",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4039,
        "addressName": "桥西区",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4040,
        "addressName": "新华区",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4041,
        "addressName": "井陉矿区",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4042,
        "addressName": "裕华区",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4043,
        "addressName": "井陉县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4044,
        "addressName": "正定县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4045,
        "addressName": "栾城县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4046,
        "addressName": "行唐县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4047,
        "addressName": "灵寿县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4048,
        "addressName": "高邑县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4049,
        "addressName": "深泽县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4050,
        "addressName": "赞皇县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4051,
        "addressName": "无极县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4052,
        "addressName": "平山县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4053,
        "addressName": "元氏县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4054,
        "addressName": "赵县",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4055,
        "addressName": "辛集市",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4056,
        "addressName": "藁城市",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4057,
        "addressName": "晋州市",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4058,
        "addressName": "新乐市",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4059,
        "addressName": "鹿泉市",
        "type": "AREA",
        "parentAddressId": 3003
      },
      {
        "addressId": 4060,
        "addressName": "路南区",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4061,
        "addressName": "路北区",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4062,
        "addressName": "古冶区",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4063,
        "addressName": "开平区",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4064,
        "addressName": "丰南区",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4065,
        "addressName": "丰润区",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4066,
        "addressName": "滦县",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4067,
        "addressName": "滦南县",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4068,
        "addressName": "乐亭县",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4069,
        "addressName": "迁西县",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4070,
        "addressName": "玉田县",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4071,
        "addressName": "唐海县",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4072,
        "addressName": "遵化市",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4073,
        "addressName": "迁安市",
        "type": "AREA",
        "parentAddressId": 3004
      },
      {
        "addressId": 4074,
        "addressName": "海港区",
        "type": "AREA",
        "parentAddressId": 3005
      },
      {
        "addressId": 4075,
        "addressName": "山海关区",
        "type": "AREA",
        "parentAddressId": 3005
      },
      {
        "addressId": 4076,
        "addressName": "北戴河区",
        "type": "AREA",
        "parentAddressId": 3005
      },
      {
        "addressId": 4077,
        "addressName": "青龙满族自治县",
        "type": "AREA",
        "parentAddressId": 3005
      },
      {
        "addressId": 4078,
        "addressName": "昌黎县",
        "type": "AREA",
        "parentAddressId": 3005
      },
      {
        "addressId": 4079,
        "addressName": "抚宁县",
        "type": "AREA",
        "parentAddressId": 3005
      },
      {
        "addressId": 4080,
        "addressName": "卢龙县",
        "type": "AREA",
        "parentAddressId": 3005
      },
      {
        "addressId": 4081,
        "addressName": "邯山区",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4082,
        "addressName": "丛台区",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4083,
        "addressName": "复兴区",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4084,
        "addressName": "峰峰矿区",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4085,
        "addressName": "邯郸县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4086,
        "addressName": "临漳县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4087,
        "addressName": "成安县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4088,
        "addressName": "大名县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4089,
        "addressName": "涉县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4090,
        "addressName": "磁县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4091,
        "addressName": "肥乡县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4092,
        "addressName": "永年县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4093,
        "addressName": "邱县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4094,
        "addressName": "鸡泽县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4095,
        "addressName": "广平县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4096,
        "addressName": "馆陶县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4097,
        "addressName": "魏县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4098,
        "addressName": "曲周县",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4099,
        "addressName": "武安市",
        "type": "AREA",
        "parentAddressId": 3006
      },
      {
        "addressId": 4100,
        "addressName": "桥东区",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4101,
        "addressName": "桥西区",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4102,
        "addressName": "邢台县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4103,
        "addressName": "临城县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4104,
        "addressName": "内丘县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4105,
        "addressName": "柏乡县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4106,
        "addressName": "隆尧县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4107,
        "addressName": "任县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4108,
        "addressName": "南和县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4109,
        "addressName": "宁晋县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4110,
        "addressName": "巨鹿县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4111,
        "addressName": "新河县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4112,
        "addressName": "广宗县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4113,
        "addressName": "平乡县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4114,
        "addressName": "威县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4115,
        "addressName": "清河县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4116,
        "addressName": "临西县",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4117,
        "addressName": "南宫市",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4118,
        "addressName": "沙河市",
        "type": "AREA",
        "parentAddressId": 3007
      },
      {
        "addressId": 4119,
        "addressName": "新市区",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4120,
        "addressName": "北市区",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4121,
        "addressName": "南市区",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4122,
        "addressName": "满城县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4123,
        "addressName": "清苑县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4124,
        "addressName": "涞水县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4125,
        "addressName": "阜平县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4126,
        "addressName": "徐水县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4127,
        "addressName": "定兴县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4128,
        "addressName": "唐县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4129,
        "addressName": "高阳县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4130,
        "addressName": "容城县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4131,
        "addressName": "涞源县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4132,
        "addressName": "望都县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4133,
        "addressName": "安新县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4134,
        "addressName": "易县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4135,
        "addressName": "曲阳县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4136,
        "addressName": "蠡县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4137,
        "addressName": "顺平县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4138,
        "addressName": "博野县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4139,
        "addressName": "雄县",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4140,
        "addressName": "涿州市",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4141,
        "addressName": "定州市",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4142,
        "addressName": "安国市",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4143,
        "addressName": "高碑店市",
        "type": "AREA",
        "parentAddressId": 3008
      },
      {
        "addressId": 4144,
        "addressName": "桥东区",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4145,
        "addressName": "桥西区",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4146,
        "addressName": "宣化区",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4147,
        "addressName": "下花园区",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4148,
        "addressName": "宣化县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4149,
        "addressName": "张北县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4150,
        "addressName": "康保县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4151,
        "addressName": "沽源县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4152,
        "addressName": "尚义县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4153,
        "addressName": "蔚县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4154,
        "addressName": "阳原县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4155,
        "addressName": "怀安县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4156,
        "addressName": "万全县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4157,
        "addressName": "怀来县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4158,
        "addressName": "涿鹿县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4159,
        "addressName": "赤城县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4160,
        "addressName": "崇礼县",
        "type": "AREA",
        "parentAddressId": 3009
      },
      {
        "addressId": 4161,
        "addressName": "双桥区",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4162,
        "addressName": "双滦区",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4163,
        "addressName": "鹰手营子矿区",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4164,
        "addressName": "承德县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4165,
        "addressName": "兴隆县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4166,
        "addressName": "平泉县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4167,
        "addressName": "滦平县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4168,
        "addressName": "隆化县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4169,
        "addressName": "丰宁满族自治县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4170,
        "addressName": "宽城满族自治县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4171,
        "addressName": "围场满族蒙古族自治县",
        "type": "AREA",
        "parentAddressId": 3010
      },
      {
        "addressId": 4172,
        "addressName": "新华区",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4173,
        "addressName": "运河区",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4174,
        "addressName": "沧县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4175,
        "addressName": "青县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4176,
        "addressName": "东光县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4177,
        "addressName": "海兴县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4178,
        "addressName": "盐山县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4179,
        "addressName": "肃宁县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4180,
        "addressName": "南皮县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4181,
        "addressName": "吴桥县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4182,
        "addressName": "献县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4183,
        "addressName": "孟村回族自治县",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4184,
        "addressName": "泊头市",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4185,
        "addressName": "任丘市",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4186,
        "addressName": "黄骅市",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4187,
        "addressName": "河间市",
        "type": "AREA",
        "parentAddressId": 3011
      },
      {
        "addressId": 4188,
        "addressName": "安次区",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4189,
        "addressName": "广阳区",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4190,
        "addressName": "固安县",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4191,
        "addressName": "永清县",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4192,
        "addressName": "香河县",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4193,
        "addressName": "大城县",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4194,
        "addressName": "文安县",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4195,
        "addressName": "大厂回族自治县",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4196,
        "addressName": "霸州市",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4197,
        "addressName": "三河市",
        "type": "AREA",
        "parentAddressId": 3012
      },
      {
        "addressId": 4198,
        "addressName": "桃城区",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4199,
        "addressName": "枣强县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4200,
        "addressName": "武邑县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4201,
        "addressName": "武强县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4202,
        "addressName": "饶阳县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4203,
        "addressName": "安平县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4204,
        "addressName": "故城县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4205,
        "addressName": "景县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4206,
        "addressName": "阜城县",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4207,
        "addressName": "冀州市",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4208,
        "addressName": "深州市",
        "type": "AREA",
        "parentAddressId": 3013
      },
      {
        "addressId": 4209,
        "addressName": "小店区",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4210,
        "addressName": "迎泽区",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4211,
        "addressName": "杏花岭区",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4212,
        "addressName": "尖草坪区",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4213,
        "addressName": "万柏林区",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4214,
        "addressName": "晋源区",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4215,
        "addressName": "清徐县",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4216,
        "addressName": "阳曲县",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4217,
        "addressName": "娄烦县",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4218,
        "addressName": "古交市",
        "type": "AREA",
        "parentAddressId": 3014
      },
      {
        "addressId": 4219,
        "addressName": "城区",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4220,
        "addressName": "矿区",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4221,
        "addressName": "南郊区",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4222,
        "addressName": "新荣区",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4223,
        "addressName": "阳高县",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4224,
        "addressName": "天镇县",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4225,
        "addressName": "广灵县",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4226,
        "addressName": "灵丘县",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4227,
        "addressName": "浑源县",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4228,
        "addressName": "左云县",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4229,
        "addressName": "大同县",
        "type": "AREA",
        "parentAddressId": 3015
      },
      {
        "addressId": 4230,
        "addressName": "城区",
        "type": "AREA",
        "parentAddressId": 3016
      },
      {
        "addressId": 4231,
        "addressName": "矿区",
        "type": "AREA",
        "parentAddressId": 3016
      },
      {
        "addressId": 4232,
        "addressName": "郊区",
        "type": "AREA",
        "parentAddressId": 3016
      },
      {
        "addressId": 4233,
        "addressName": "平定县",
        "type": "AREA",
        "parentAddressId": 3016
      },
      {
        "addressId": 4234,
        "addressName": "盂县",
        "type": "AREA",
        "parentAddressId": 3016
      },
      {
        "addressId": 4235,
        "addressName": "城区",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4236,
        "addressName": "郊区",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4237,
        "addressName": "长治县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4238,
        "addressName": "襄垣县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4239,
        "addressName": "屯留县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4240,
        "addressName": "平顺县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4241,
        "addressName": "黎城县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4242,
        "addressName": "壶关县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4243,
        "addressName": "长子县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4244,
        "addressName": "武乡县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4245,
        "addressName": "沁县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4246,
        "addressName": "沁源县",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4247,
        "addressName": "潞城市",
        "type": "AREA",
        "parentAddressId": 3017
      },
      {
        "addressId": 4248,
        "addressName": "城区",
        "type": "AREA",
        "parentAddressId": 3018
      },
      {
        "addressId": 4249,
        "addressName": "沁水县",
        "type": "AREA",
        "parentAddressId": 3018
      },
      {
        "addressId": 4250,
        "addressName": "阳城县",
        "type": "AREA",
        "parentAddressId": 3018
      },
      {
        "addressId": 4251,
        "addressName": "陵川县",
        "type": "AREA",
        "parentAddressId": 3018
      },
      {
        "addressId": 4252,
        "addressName": "泽州县",
        "type": "AREA",
        "parentAddressId": 3018
      },
      {
        "addressId": 4253,
        "addressName": "高平市",
        "type": "AREA",
        "parentAddressId": 3018
      },
      {
        "addressId": 4254,
        "addressName": "朔城区",
        "type": "AREA",
        "parentAddressId": 3019
      },
      {
        "addressId": 4255,
        "addressName": "平鲁区",
        "type": "AREA",
        "parentAddressId": 3019
      },
      {
        "addressId": 4256,
        "addressName": "山阴县",
        "type": "AREA",
        "parentAddressId": 3019
      },
      {
        "addressId": 4257,
        "addressName": "应县",
        "type": "AREA",
        "parentAddressId": 3019
      },
      {
        "addressId": 4258,
        "addressName": "右玉县",
        "type": "AREA",
        "parentAddressId": 3019
      },
      {
        "addressId": 4259,
        "addressName": "怀仁县",
        "type": "AREA",
        "parentAddressId": 3019
      },
      {
        "addressId": 4260,
        "addressName": "榆次区",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4261,
        "addressName": "榆社县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4262,
        "addressName": "左权县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4263,
        "addressName": "和顺县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4264,
        "addressName": "昔阳县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4265,
        "addressName": "寿阳县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4266,
        "addressName": "太谷县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4267,
        "addressName": "祁县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4268,
        "addressName": "平遥县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4269,
        "addressName": "灵石县",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4270,
        "addressName": "介休市",
        "type": "AREA",
        "parentAddressId": 3020
      },
      {
        "addressId": 4271,
        "addressName": "盐湖区",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4272,
        "addressName": "临猗县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4273,
        "addressName": "万荣县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4274,
        "addressName": "闻喜县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4275,
        "addressName": "稷山县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4276,
        "addressName": "新绛县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4277,
        "addressName": "绛县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4278,
        "addressName": "垣曲县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4279,
        "addressName": "夏县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4280,
        "addressName": "平陆县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4281,
        "addressName": "芮城县",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4282,
        "addressName": "永济市",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4283,
        "addressName": "河津市",
        "type": "AREA",
        "parentAddressId": 3021
      },
      {
        "addressId": 4284,
        "addressName": "忻府区",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4285,
        "addressName": "定襄县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4286,
        "addressName": "五台县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4287,
        "addressName": "代县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4288,
        "addressName": "繁峙县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4289,
        "addressName": "宁武县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4290,
        "addressName": "静乐县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4291,
        "addressName": "神池县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4292,
        "addressName": "五寨县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4293,
        "addressName": "岢岚县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4294,
        "addressName": "河曲县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4295,
        "addressName": "保德县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4296,
        "addressName": "偏关县",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4297,
        "addressName": "原平市",
        "type": "AREA",
        "parentAddressId": 3022
      },
      {
        "addressId": 4298,
        "addressName": "尧都区",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4299,
        "addressName": "曲沃县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4300,
        "addressName": "翼城县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4301,
        "addressName": "襄汾县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4302,
        "addressName": "洪洞县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4303,
        "addressName": "古县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4304,
        "addressName": "安泽县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4305,
        "addressName": "浮山县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4306,
        "addressName": "吉县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4307,
        "addressName": "乡宁县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4308,
        "addressName": "大宁县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4309,
        "addressName": "隰县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4310,
        "addressName": "永和县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4311,
        "addressName": "蒲县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4312,
        "addressName": "汾西县",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4313,
        "addressName": "侯马市",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4314,
        "addressName": "霍州市",
        "type": "AREA",
        "parentAddressId": 3023
      },
      {
        "addressId": 4315,
        "addressName": "离石区",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4316,
        "addressName": "文水县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4317,
        "addressName": "交城县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4318,
        "addressName": "兴县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4319,
        "addressName": "临县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4320,
        "addressName": "柳林县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4321,
        "addressName": "石楼县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4322,
        "addressName": "岚县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4323,
        "addressName": "方山县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4324,
        "addressName": "中阳县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4325,
        "addressName": "交口县",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4326,
        "addressName": "孝义市",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4327,
        "addressName": "汾阳市",
        "type": "AREA",
        "parentAddressId": 3024
      },
      {
        "addressId": 4328,
        "addressName": "新城区",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4329,
        "addressName": "回民区",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4330,
        "addressName": "玉泉区",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4331,
        "addressName": "赛罕区",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4332,
        "addressName": "土默特左旗",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4333,
        "addressName": "托克托县",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4334,
        "addressName": "和林格尔县",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4335,
        "addressName": "清水河县",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4336,
        "addressName": "武川县",
        "type": "AREA",
        "parentAddressId": 3025
      },
      {
        "addressId": 4337,
        "addressName": "东河区",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4338,
        "addressName": "昆都仑区",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4339,
        "addressName": "青山区",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4340,
        "addressName": "石拐区",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4341,
        "addressName": "白云矿区",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4342,
        "addressName": "九原区",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4343,
        "addressName": "土默特右旗",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4344,
        "addressName": "固阳县",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4345,
        "addressName": "达尔罕茂明安联合旗",
        "type": "AREA",
        "parentAddressId": 3026
      },
      {
        "addressId": 4346,
        "addressName": "海勃湾区",
        "type": "AREA",
        "parentAddressId": 3027
      },
      {
        "addressId": 4347,
        "addressName": "海南区",
        "type": "AREA",
        "parentAddressId": 3027
      },
      {
        "addressId": 4348,
        "addressName": "乌达区",
        "type": "AREA",
        "parentAddressId": 3027
      },
      {
        "addressId": 4349,
        "addressName": "红山区",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4350,
        "addressName": "元宝山区",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4351,
        "addressName": "松山区",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4352,
        "addressName": "阿鲁科尔沁旗",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4353,
        "addressName": "巴林左旗",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4354,
        "addressName": "巴林右旗",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4355,
        "addressName": "林西县",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4356,
        "addressName": "克什克腾旗",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4357,
        "addressName": "翁牛特旗",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4358,
        "addressName": "喀喇沁旗",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4359,
        "addressName": "宁城县",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4360,
        "addressName": "敖汉旗",
        "type": "AREA",
        "parentAddressId": 3028
      },
      {
        "addressId": 4361,
        "addressName": "科尔沁区",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4362,
        "addressName": "科尔沁左翼中旗",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4363,
        "addressName": "科尔沁左翼后旗",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4364,
        "addressName": "开鲁县",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4365,
        "addressName": "库伦旗",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4366,
        "addressName": "奈曼旗",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4367,
        "addressName": "扎鲁特旗",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4368,
        "addressName": "霍林郭勒市",
        "type": "AREA",
        "parentAddressId": 3029
      },
      {
        "addressId": 4369,
        "addressName": "东胜区",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4370,
        "addressName": "达拉特旗",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4371,
        "addressName": "准格尔旗",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4372,
        "addressName": "鄂托克前旗",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4373,
        "addressName": "鄂托克旗",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4374,
        "addressName": "杭锦旗",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4375,
        "addressName": "乌审旗",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4376,
        "addressName": "伊金霍洛旗",
        "type": "AREA",
        "parentAddressId": 3030
      },
      {
        "addressId": 4377,
        "addressName": "海拉尔区",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4378,
        "addressName": "阿荣旗",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4379,
        "addressName": "莫力达瓦达斡尔族自治旗",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4380,
        "addressName": "鄂伦春自治旗",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4381,
        "addressName": "鄂温克族自治旗",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4382,
        "addressName": "陈巴尔虎旗",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4383,
        "addressName": "新巴尔虎左旗",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4384,
        "addressName": "新巴尔虎右旗",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4385,
        "addressName": "满洲里市",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4386,
        "addressName": "牙克石市",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4387,
        "addressName": "扎兰屯市",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4388,
        "addressName": "额尔古纳市",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4389,
        "addressName": "根河市",
        "type": "AREA",
        "parentAddressId": 3031
      },
      {
        "addressId": 4390,
        "addressName": "临河区",
        "type": "AREA",
        "parentAddressId": 3032
      },
      {
        "addressId": 4391,
        "addressName": "五原县",
        "type": "AREA",
        "parentAddressId": 3032
      },
      {
        "addressId": 4392,
        "addressName": "磴口县",
        "type": "AREA",
        "parentAddressId": 3032
      },
      {
        "addressId": 4393,
        "addressName": "乌拉特前旗",
        "type": "AREA",
        "parentAddressId": 3032
      },
      {
        "addressId": 4394,
        "addressName": "乌拉特中旗",
        "type": "AREA",
        "parentAddressId": 3032
      },
      {
        "addressId": 4395,
        "addressName": "乌拉特后旗",
        "type": "AREA",
        "parentAddressId": 3032
      },
      {
        "addressId": 4396,
        "addressName": "杭锦后旗",
        "type": "AREA",
        "parentAddressId": 3032
      },
      {
        "addressId": 4397,
        "addressName": "集宁区",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4398,
        "addressName": "卓资县",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4399,
        "addressName": "化德县",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4400,
        "addressName": "商都县",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4401,
        "addressName": "兴和县",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4402,
        "addressName": "凉城县",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4403,
        "addressName": "察哈尔右翼前旗",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4404,
        "addressName": "察哈尔右翼中旗",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4405,
        "addressName": "察哈尔右翼后旗",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4406,
        "addressName": "四子王旗",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4407,
        "addressName": "丰镇市",
        "type": "AREA",
        "parentAddressId": 3033
      },
      {
        "addressId": 4408,
        "addressName": "乌兰浩特市",
        "type": "AREA",
        "parentAddressId": 3034
      },
      {
        "addressId": 4409,
        "addressName": "阿尔山市",
        "type": "AREA",
        "parentAddressId": 3034
      },
      {
        "addressId": 4410,
        "addressName": "科尔沁右翼前旗",
        "type": "AREA",
        "parentAddressId": 3034
      },
      {
        "addressId": 4411,
        "addressName": "科尔沁右翼中旗",
        "type": "AREA",
        "parentAddressId": 3034
      },
      {
        "addressId": 4412,
        "addressName": "扎赉特旗",
        "type": "AREA",
        "parentAddressId": 3034
      },
      {
        "addressId": 4413,
        "addressName": "突泉县",
        "type": "AREA",
        "parentAddressId": 3034
      },
      {
        "addressId": 4414,
        "addressName": "二连浩特市",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4415,
        "addressName": "锡林浩特市",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4416,
        "addressName": "阿巴嘎旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4417,
        "addressName": "苏尼特左旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4418,
        "addressName": "苏尼特右旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4419,
        "addressName": "东乌珠穆沁旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4420,
        "addressName": "西乌珠穆沁旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4421,
        "addressName": "太仆寺旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4422,
        "addressName": "镶黄旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4423,
        "addressName": "正镶白旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4424,
        "addressName": "正蓝旗",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4425,
        "addressName": "多伦县",
        "type": "AREA",
        "parentAddressId": 3035
      },
      {
        "addressId": 4426,
        "addressName": "阿拉善左旗",
        "type": "AREA",
        "parentAddressId": 3036
      },
      {
        "addressId": 4427,
        "addressName": "阿拉善右旗",
        "type": "AREA",
        "parentAddressId": 3036
      },
      {
        "addressId": 4428,
        "addressName": "额济纳旗",
        "type": "AREA",
        "parentAddressId": 3036
      },
      {
        "addressId": 4429,
        "addressName": "和平区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4430,
        "addressName": "沈河区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4431,
        "addressName": "大东区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4432,
        "addressName": "皇姑区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4433,
        "addressName": "铁西区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4434,
        "addressName": "苏家屯区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4435,
        "addressName": "东陵区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4436,
        "addressName": "新城子区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4437,
        "addressName": "于洪区",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4438,
        "addressName": "辽中县",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4439,
        "addressName": "康平县",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4440,
        "addressName": "法库县",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4441,
        "addressName": "新民市",
        "type": "AREA",
        "parentAddressId": 3037
      },
      {
        "addressId": 4442,
        "addressName": "中山区",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4443,
        "addressName": "西岗区",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4444,
        "addressName": "沙河口区",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4445,
        "addressName": "甘井子区",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4446,
        "addressName": "旅顺口区",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4447,
        "addressName": "金州区",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4448,
        "addressName": "长海县",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4449,
        "addressName": "瓦房店市",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4450,
        "addressName": "普兰店市",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4451,
        "addressName": "庄河市",
        "type": "AREA",
        "parentAddressId": 3038
      },
      {
        "addressId": 4452,
        "addressName": "铁东区",
        "type": "AREA",
        "parentAddressId": 3039
      },
      {
        "addressId": 4453,
        "addressName": "铁西区",
        "type": "AREA",
        "parentAddressId": 3039
      },
      {
        "addressId": 4454,
        "addressName": "立山区",
        "type": "AREA",
        "parentAddressId": 3039
      },
      {
        "addressId": 4455,
        "addressName": "千山区",
        "type": "AREA",
        "parentAddressId": 3039
      },
      {
        "addressId": 4456,
        "addressName": "台安县",
        "type": "AREA",
        "parentAddressId": 3039
      },
      {
        "addressId": 4457,
        "addressName": "岫岩满族自治县",
        "type": "AREA",
        "parentAddressId": 3039
      },
      {
        "addressId": 4458,
        "addressName": "海城市",
        "type": "AREA",
        "parentAddressId": 3039
      },
      {
        "addressId": 4459,
        "addressName": "新抚区",
        "type": "AREA",
        "parentAddressId": 3040
      },
      {
        "addressId": 4460,
        "addressName": "东洲区",
        "type": "AREA",
        "parentAddressId": 3040
      },
      {
        "addressId": 4461,
        "addressName": "望花区",
        "type": "AREA",
        "parentAddressId": 3040
      },
      {
        "addressId": 4462,
        "addressName": "顺城区",
        "type": "AREA",
        "parentAddressId": 3040
      },
      {
        "addressId": 4463,
        "addressName": "抚顺县",
        "type": "AREA",
        "parentAddressId": 3040
      },
      {
        "addressId": 4464,
        "addressName": "新宾满族自治县",
        "type": "AREA",
        "parentAddressId": 3040
      },
      {
        "addressId": 4465,
        "addressName": "清原满族自治县",
        "type": "AREA",
        "parentAddressId": 3040
      },
      {
        "addressId": 4466,
        "addressName": "平山区",
        "type": "AREA",
        "parentAddressId": 3041
      },
      {
        "addressId": 4467,
        "addressName": "溪湖区",
        "type": "AREA",
        "parentAddressId": 3041
      },
      {
        "addressId": 4468,
        "addressName": "明山区",
        "type": "AREA",
        "parentAddressId": 3041
      },
      {
        "addressId": 4469,
        "addressName": "南芬区",
        "type": "AREA",
        "parentAddressId": 3041
      },
      {
        "addressId": 4470,
        "addressName": "本溪满族自治县",
        "type": "AREA",
        "parentAddressId": 3041
      },
      {
        "addressId": 4471,
        "addressName": "桓仁满族自治县",
        "type": "AREA",
        "parentAddressId": 3041
      },
      {
        "addressId": 4472,
        "addressName": "元宝区",
        "type": "AREA",
        "parentAddressId": 3042
      },
      {
        "addressId": 4473,
        "addressName": "振兴区",
        "type": "AREA",
        "parentAddressId": 3042
      },
      {
        "addressId": 4474,
        "addressName": "振安区",
        "type": "AREA",
        "parentAddressId": 3042
      },
      {
        "addressId": 4475,
        "addressName": "宽甸满族自治县",
        "type": "AREA",
        "parentAddressId": 3042
      },
      {
        "addressId": 4476,
        "addressName": "东港市",
        "type": "AREA",
        "parentAddressId": 3042
      },
      {
        "addressId": 4477,
        "addressName": "凤城市",
        "type": "AREA",
        "parentAddressId": 3042
      },
      {
        "addressId": 4478,
        "addressName": "古塔区",
        "type": "AREA",
        "parentAddressId": 3043
      },
      {
        "addressId": 4479,
        "addressName": "凌河区",
        "type": "AREA",
        "parentAddressId": 3043
      },
      {
        "addressId": 4480,
        "addressName": "太和区",
        "type": "AREA",
        "parentAddressId": 3043
      },
      {
        "addressId": 4481,
        "addressName": "黑山县",
        "type": "AREA",
        "parentAddressId": 3043
      },
      {
        "addressId": 4482,
        "addressName": "义县",
        "type": "AREA",
        "parentAddressId": 3043
      },
      {
        "addressId": 4483,
        "addressName": "凌海市",
        "type": "AREA",
        "parentAddressId": 3043
      },
      {
        "addressId": 4484,
        "addressName": "北宁市",
        "type": "AREA",
        "parentAddressId": 3043
      },
      {
        "addressId": 4485,
        "addressName": "站前区",
        "type": "AREA",
        "parentAddressId": 3044
      },
      {
        "addressId": 4486,
        "addressName": "西市区",
        "type": "AREA",
        "parentAddressId": 3044
      },
      {
        "addressId": 4487,
        "addressName": "鲅鱼圈区",
        "type": "AREA",
        "parentAddressId": 3044
      },
      {
        "addressId": 4488,
        "addressName": "老边区",
        "type": "AREA",
        "parentAddressId": 3044
      },
      {
        "addressId": 4489,
        "addressName": "盖州市",
        "type": "AREA",
        "parentAddressId": 3044
      },
      {
        "addressId": 4490,
        "addressName": "大石桥市",
        "type": "AREA",
        "parentAddressId": 3044
      },
      {
        "addressId": 4491,
        "addressName": "海州区",
        "type": "AREA",
        "parentAddressId": 3045
      },
      {
        "addressId": 4492,
        "addressName": "新邱区",
        "type": "AREA",
        "parentAddressId": 3045
      },
      {
        "addressId": 4493,
        "addressName": "太平区",
        "type": "AREA",
        "parentAddressId": 3045
      },
      {
        "addressId": 4494,
        "addressName": "清河门区",
        "type": "AREA",
        "parentAddressId": 3045
      },
      {
        "addressId": 4495,
        "addressName": "细河区",
        "type": "AREA",
        "parentAddressId": 3045
      },
      {
        "addressId": 4496,
        "addressName": "阜新蒙古族自治县",
        "type": "AREA",
        "parentAddressId": 3045
      },
      {
        "addressId": 4497,
        "addressName": "彰武县",
        "type": "AREA",
        "parentAddressId": 3045
      },
      {
        "addressId": 4498,
        "addressName": "白塔区",
        "type": "AREA",
        "parentAddressId": 3046
      },
      {
        "addressId": 4499,
        "addressName": "文圣区",
        "type": "AREA",
        "parentAddressId": 3046
      },
      {
        "addressId": 4500,
        "addressName": "宏伟区",
        "type": "AREA",
        "parentAddressId": 3046
      },
      {
        "addressId": 4501,
        "addressName": "弓长岭区",
        "type": "AREA",
        "parentAddressId": 3046
      },
      {
        "addressId": 4502,
        "addressName": "太子河区",
        "type": "AREA",
        "parentAddressId": 3046
      },
      {
        "addressId": 4503,
        "addressName": "辽阳县",
        "type": "AREA",
        "parentAddressId": 3046
      },
      {
        "addressId": 4504,
        "addressName": "灯塔市",
        "type": "AREA",
        "parentAddressId": 3046
      },
      {
        "addressId": 4505,
        "addressName": "双台子区",
        "type": "AREA",
        "parentAddressId": 3047
      },
      {
        "addressId": 4506,
        "addressName": "兴隆台区",
        "type": "AREA",
        "parentAddressId": 3047
      },
      {
        "addressId": 4507,
        "addressName": "大洼县",
        "type": "AREA",
        "parentAddressId": 3047
      },
      {
        "addressId": 4508,
        "addressName": "盘山县",
        "type": "AREA",
        "parentAddressId": 3047
      },
      {
        "addressId": 4509,
        "addressName": "银州区",
        "type": "AREA",
        "parentAddressId": 3048
      },
      {
        "addressId": 4510,
        "addressName": "清河区",
        "type": "AREA",
        "parentAddressId": 3048
      },
      {
        "addressId": 4511,
        "addressName": "铁岭县",
        "type": "AREA",
        "parentAddressId": 3048
      },
      {
        "addressId": 4512,
        "addressName": "西丰县",
        "type": "AREA",
        "parentAddressId": 3048
      },
      {
        "addressId": 4513,
        "addressName": "昌图县",
        "type": "AREA",
        "parentAddressId": 3048
      },
      {
        "addressId": 4514,
        "addressName": "调兵山市",
        "type": "AREA",
        "parentAddressId": 3048
      },
      {
        "addressId": 4515,
        "addressName": "开原市",
        "type": "AREA",
        "parentAddressId": 3048
      },
      {
        "addressId": 4516,
        "addressName": "双塔区",
        "type": "AREA",
        "parentAddressId": 3049
      },
      {
        "addressId": 4517,
        "addressName": "龙城区",
        "type": "AREA",
        "parentAddressId": 3049
      },
      {
        "addressId": 4518,
        "addressName": "朝阳县",
        "type": "AREA",
        "parentAddressId": 3049
      },
      {
        "addressId": 4519,
        "addressName": "建平县",
        "type": "AREA",
        "parentAddressId": 3049
      },
      {
        "addressId": 4520,
        "addressName": "喀喇沁左翼蒙古族自治县",
        "type": "AREA",
        "parentAddressId": 3049
      },
      {
        "addressId": 4521,
        "addressName": "北票市",
        "type": "AREA",
        "parentAddressId": 3049
      },
      {
        "addressId": 4522,
        "addressName": "凌源市",
        "type": "AREA",
        "parentAddressId": 3049
      },
      {
        "addressId": 4523,
        "addressName": "连山区",
        "type": "AREA",
        "parentAddressId": 3050
      },
      {
        "addressId": 4524,
        "addressName": "龙港区",
        "type": "AREA",
        "parentAddressId": 3050
      },
      {
        "addressId": 4525,
        "addressName": "南票区",
        "type": "AREA",
        "parentAddressId": 3050
      },
      {
        "addressId": 4526,
        "addressName": "绥中县",
        "type": "AREA",
        "parentAddressId": 3050
      },
      {
        "addressId": 4527,
        "addressName": "建昌县",
        "type": "AREA",
        "parentAddressId": 3050
      },
      {
        "addressId": 4528,
        "addressName": "兴城市",
        "type": "AREA",
        "parentAddressId": 3050
      },
      {
        "addressId": 4529,
        "addressName": "南关区",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4530,
        "addressName": "宽城区",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4531,
        "addressName": "朝阳区",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4532,
        "addressName": "二道区",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4533,
        "addressName": "绿园区",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4534,
        "addressName": "双阳区",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4535,
        "addressName": "农安县",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4536,
        "addressName": "九台市",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4537,
        "addressName": "榆树市",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4538,
        "addressName": "德惠市",
        "type": "AREA",
        "parentAddressId": 3051
      },
      {
        "addressId": 4539,
        "addressName": "昌邑区",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4540,
        "addressName": "龙潭区",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4541,
        "addressName": "船营区",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4542,
        "addressName": "丰满区",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4543,
        "addressName": "永吉县",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4544,
        "addressName": "蛟河市",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4545,
        "addressName": "桦甸市",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4546,
        "addressName": "舒兰市",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4547,
        "addressName": "磐石市",
        "type": "AREA",
        "parentAddressId": 3052
      },
      {
        "addressId": 4548,
        "addressName": "铁西区",
        "type": "AREA",
        "parentAddressId": 3053
      },
      {
        "addressId": 4549,
        "addressName": "铁东区",
        "type": "AREA",
        "parentAddressId": 3053
      },
      {
        "addressId": 4550,
        "addressName": "梨树县",
        "type": "AREA",
        "parentAddressId": 3053
      },
      {
        "addressId": 4551,
        "addressName": "伊通满族自治县",
        "type": "AREA",
        "parentAddressId": 3053
      },
      {
        "addressId": 4552,
        "addressName": "公主岭市",
        "type": "AREA",
        "parentAddressId": 3053
      },
      {
        "addressId": 4553,
        "addressName": "双辽市",
        "type": "AREA",
        "parentAddressId": 3053
      },
      {
        "addressId": 4554,
        "addressName": "龙山区",
        "type": "AREA",
        "parentAddressId": 3054
      },
      {
        "addressId": 4555,
        "addressName": "西安区",
        "type": "AREA",
        "parentAddressId": 3054
      },
      {
        "addressId": 4556,
        "addressName": "东丰县",
        "type": "AREA",
        "parentAddressId": 3054
      },
      {
        "addressId": 4557,
        "addressName": "东辽县",
        "type": "AREA",
        "parentAddressId": 3054
      },
      {
        "addressId": 4558,
        "addressName": "东昌区",
        "type": "AREA",
        "parentAddressId": 3055
      },
      {
        "addressId": 4559,
        "addressName": "二道江区",
        "type": "AREA",
        "parentAddressId": 3055
      },
      {
        "addressId": 4560,
        "addressName": "通化县",
        "type": "AREA",
        "parentAddressId": 3055
      },
      {
        "addressId": 4561,
        "addressName": "辉南县",
        "type": "AREA",
        "parentAddressId": 3055
      },
      {
        "addressId": 4562,
        "addressName": "柳河县",
        "type": "AREA",
        "parentAddressId": 3055
      },
      {
        "addressId": 4563,
        "addressName": "梅河口市",
        "type": "AREA",
        "parentAddressId": 3055
      },
      {
        "addressId": 4564,
        "addressName": "集安市",
        "type": "AREA",
        "parentAddressId": 3055
      },
      {
        "addressId": 4565,
        "addressName": "八道江区",
        "type": "AREA",
        "parentAddressId": 3056
      },
      {
        "addressId": 4566,
        "addressName": "抚松县",
        "type": "AREA",
        "parentAddressId": 3056
      },
      {
        "addressId": 4567,
        "addressName": "靖宇县",
        "type": "AREA",
        "parentAddressId": 3056
      },
      {
        "addressId": 4568,
        "addressName": "长白朝鲜族自治县",
        "type": "AREA",
        "parentAddressId": 3056
      },
      {
        "addressId": 4569,
        "addressName": "江源县",
        "type": "AREA",
        "parentAddressId": 3056
      },
      {
        "addressId": 4570,
        "addressName": "临江市",
        "type": "AREA",
        "parentAddressId": 3056
      },
      {
        "addressId": 4571,
        "addressName": "宁江区",
        "type": "AREA",
        "parentAddressId": 3057
      },
      {
        "addressId": 4572,
        "addressName": "前郭尔罗斯蒙古族自治县",
        "type": "AREA",
        "parentAddressId": 3057
      },
      {
        "addressId": 4573,
        "addressName": "长岭县",
        "type": "AREA",
        "parentAddressId": 3057
      },
      {
        "addressId": 4574,
        "addressName": "乾安县",
        "type": "AREA",
        "parentAddressId": 3057
      },
      {
        "addressId": 4575,
        "addressName": "扶余县",
        "type": "AREA",
        "parentAddressId": 3057
      },
      {
        "addressId": 4576,
        "addressName": "洮北区",
        "type": "AREA",
        "parentAddressId": 3058
      },
      {
        "addressId": 4577,
        "addressName": "镇赉县",
        "type": "AREA",
        "parentAddressId": 3058
      },
      {
        "addressId": 4578,
        "addressName": "通榆县",
        "type": "AREA",
        "parentAddressId": 3058
      },
      {
        "addressId": 4579,
        "addressName": "洮南市",
        "type": "AREA",
        "parentAddressId": 3058
      },
      {
        "addressId": 4580,
        "addressName": "大安市",
        "type": "AREA",
        "parentAddressId": 3058
      },
      {
        "addressId": 4581,
        "addressName": "延吉市",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4582,
        "addressName": "图们市",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4583,
        "addressName": "敦化市",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4584,
        "addressName": "珲春市",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4585,
        "addressName": "龙井市",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4586,
        "addressName": "和龙市",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4587,
        "addressName": "汪清县",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4588,
        "addressName": "安图县",
        "type": "AREA",
        "parentAddressId": 3059
      },
      {
        "addressId": 4589,
        "addressName": "道里区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4590,
        "addressName": "南岗区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4591,
        "addressName": "道外区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4592,
        "addressName": "香坊区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4593,
        "addressName": "动力区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4594,
        "addressName": "平房区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4595,
        "addressName": "松北区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4596,
        "addressName": "呼兰区",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4597,
        "addressName": "依兰县",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4598,
        "addressName": "方正县",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4599,
        "addressName": "宾县",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4600,
        "addressName": "巴彦县",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4601,
        "addressName": "木兰县",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4602,
        "addressName": "通河县",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4603,
        "addressName": "延寿县",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4604,
        "addressName": "阿城市",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4605,
        "addressName": "双城市",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4606,
        "addressName": "尚志市",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4607,
        "addressName": "五常市",
        "type": "AREA",
        "parentAddressId": 3060
      },
      {
        "addressId": 4608,
        "addressName": "龙沙区",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4609,
        "addressName": "建华区",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4610,
        "addressName": "铁锋区",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4611,
        "addressName": "昂昂溪区",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4612,
        "addressName": "富拉尔基区",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4613,
        "addressName": "碾子山区",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4614,
        "addressName": "梅里斯达斡尔族区",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4615,
        "addressName": "龙江县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4616,
        "addressName": "依安县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4617,
        "addressName": "泰来县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4618,
        "addressName": "甘南县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4619,
        "addressName": "富裕县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4620,
        "addressName": "克山县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4621,
        "addressName": "克东县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4622,
        "addressName": "拜泉县",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4623,
        "addressName": "讷河市",
        "type": "AREA",
        "parentAddressId": 3061
      },
      {
        "addressId": 4624,
        "addressName": "鸡冠区",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4625,
        "addressName": "恒山区",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4626,
        "addressName": "滴道区",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4627,
        "addressName": "梨树区",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4628,
        "addressName": "城子河区",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4629,
        "addressName": "麻山区",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4630,
        "addressName": "鸡东县",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4631,
        "addressName": "虎林市",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4632,
        "addressName": "密山市",
        "type": "AREA",
        "parentAddressId": 3062
      },
      {
        "addressId": 4633,
        "addressName": "向阳区",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4634,
        "addressName": "工农区",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4635,
        "addressName": "南山区",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4636,
        "addressName": "兴安区",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4637,
        "addressName": "东山区",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4638,
        "addressName": "兴山区",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4639,
        "addressName": "萝北县",
        "type": "AREA",
        "parentAddressId": 3063
      },
      {
        "addressId": 4851,
        "addressName": "余杭区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4852,
        "addressName": "桐庐县",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4853,
        "addressName": "淳安县",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4854,
        "addressName": "建德市",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4855,
        "addressName": "富阳市",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4856,
        "addressName": "临安市",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4857,
        "addressName": "海曙区",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4858,
        "addressName": "江东区",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4859,
        "addressName": "江北区",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4860,
        "addressName": "北仑区",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4861,
        "addressName": "镇海区",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4862,
        "addressName": "鄞州区",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4863,
        "addressName": "象山县",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4864,
        "addressName": "宁海县",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4865,
        "addressName": "余姚市",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4866,
        "addressName": "慈溪市",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4867,
        "addressName": "奉化市",
        "type": "AREA",
        "parentAddressId": 3088
      },
      {
        "addressId": 4868,
        "addressName": "鹿城区",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4869,
        "addressName": "龙湾区",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4870,
        "addressName": "瓯海区",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4871,
        "addressName": "洞头县",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4872,
        "addressName": "永嘉县",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4873,
        "addressName": "平阳县",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4874,
        "addressName": "苍南县",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4875,
        "addressName": "文成县",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4876,
        "addressName": "泰顺县",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4877,
        "addressName": "瑞安市",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4878,
        "addressName": "乐清市",
        "type": "AREA",
        "parentAddressId": 3089
      },
      {
        "addressId": 4879,
        "addressName": "秀城区",
        "type": "AREA",
        "parentAddressId": 3090
      },
      {
        "addressId": 4880,
        "addressName": "秀洲区",
        "type": "AREA",
        "parentAddressId": 3090
      },
      {
        "addressId": 4881,
        "addressName": "嘉善县",
        "type": "AREA",
        "parentAddressId": 3090
      },
      {
        "addressId": 4882,
        "addressName": "海盐县",
        "type": "AREA",
        "parentAddressId": 3090
      },
      {
        "addressId": 4883,
        "addressName": "海宁市",
        "type": "AREA",
        "parentAddressId": 3090
      },
      {
        "addressId": 4884,
        "addressName": "平湖市",
        "type": "AREA",
        "parentAddressId": 3090
      },
      {
        "addressId": 4885,
        "addressName": "桐乡市",
        "type": "AREA",
        "parentAddressId": 3090
      },
      {
        "addressId": 4886,
        "addressName": "吴兴区",
        "type": "AREA",
        "parentAddressId": 3091
      },
      {
        "addressId": 4887,
        "addressName": "南浔区",
        "type": "AREA",
        "parentAddressId": 3091
      },
      {
        "addressId": 4888,
        "addressName": "德清县",
        "type": "AREA",
        "parentAddressId": 3091
      },
      {
        "addressId": 4889,
        "addressName": "长兴县",
        "type": "AREA",
        "parentAddressId": 3091
      },
      {
        "addressId": 4890,
        "addressName": "安吉县",
        "type": "AREA",
        "parentAddressId": 3091
      },
      {
        "addressId": 4891,
        "addressName": "越城区",
        "type": "AREA",
        "parentAddressId": 3092
      },
      {
        "addressId": 4892,
        "addressName": "绍兴县",
        "type": "AREA",
        "parentAddressId": 3092
      },
      {
        "addressId": 4893,
        "addressName": "新昌县",
        "type": "AREA",
        "parentAddressId": 3092
      },
      {
        "addressId": 4894,
        "addressName": "诸暨市",
        "type": "AREA",
        "parentAddressId": 3092
      },
      {
        "addressId": 4895,
        "addressName": "上虞市",
        "type": "AREA",
        "parentAddressId": 3092
      },
      {
        "addressId": 4896,
        "addressName": "嵊州市",
        "type": "AREA",
        "parentAddressId": 3092
      },
      {
        "addressId": 4897,
        "addressName": "婺城区",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4898,
        "addressName": "金东区",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4899,
        "addressName": "武义县",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4900,
        "addressName": "浦江县",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4901,
        "addressName": "磐安县",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4902,
        "addressName": "兰溪市",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4903,
        "addressName": "义乌市",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4904,
        "addressName": "东阳市",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4905,
        "addressName": "永康市",
        "type": "AREA",
        "parentAddressId": 3093
      },
      {
        "addressId": 4906,
        "addressName": "柯城区",
        "type": "AREA",
        "parentAddressId": 3094
      },
      {
        "addressId": 4907,
        "addressName": "衢江区",
        "type": "AREA",
        "parentAddressId": 3094
      },
      {
        "addressId": 4908,
        "addressName": "常山县",
        "type": "AREA",
        "parentAddressId": 3094
      },
      {
        "addressId": 4909,
        "addressName": "开化县",
        "type": "AREA",
        "parentAddressId": 3094
      },
      {
        "addressId": 4910,
        "addressName": "龙游县",
        "type": "AREA",
        "parentAddressId": 3094
      },
      {
        "addressId": 4911,
        "addressName": "江山市",
        "type": "AREA",
        "parentAddressId": 3094
      },
      {
        "addressId": 4912,
        "addressName": "定海区",
        "type": "AREA",
        "parentAddressId": 3095
      },
      {
        "addressId": 4913,
        "addressName": "普陀区",
        "type": "AREA",
        "parentAddressId": 3095
      },
      {
        "addressId": 4914,
        "addressName": "岱山县",
        "type": "AREA",
        "parentAddressId": 3095
      },
      {
        "addressId": 4915,
        "addressName": "嵊泗县",
        "type": "AREA",
        "parentAddressId": 3095
      },
      {
        "addressId": 4916,
        "addressName": "椒江区",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4917,
        "addressName": "黄岩区",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4918,
        "addressName": "路桥区",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4919,
        "addressName": "玉环县",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4920,
        "addressName": "三门县",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4921,
        "addressName": "天台县",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4922,
        "addressName": "仙居县",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4923,
        "addressName": "温岭市",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4924,
        "addressName": "临海市",
        "type": "AREA",
        "parentAddressId": 3096
      },
      {
        "addressId": 4925,
        "addressName": "莲都区",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4926,
        "addressName": "青田县",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4927,
        "addressName": "缙云县",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4928,
        "addressName": "遂昌县",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4929,
        "addressName": "松阳县",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4930,
        "addressName": "云和县",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4931,
        "addressName": "庆元县",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4932,
        "addressName": "景宁畲族自治县",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4933,
        "addressName": "龙泉市",
        "type": "AREA",
        "parentAddressId": 3097
      },
      {
        "addressId": 4934,
        "addressName": "瑶海区",
        "type": "AREA",
        "parentAddressId": 3098
      },
      {
        "addressId": 4935,
        "addressName": "庐阳区",
        "type": "AREA",
        "parentAddressId": 3098
      },
      {
        "addressId": 4936,
        "addressName": "蜀山区",
        "type": "AREA",
        "parentAddressId": 3098
      },
      {
        "addressId": 4937,
        "addressName": "包河区",
        "type": "AREA",
        "parentAddressId": 3098
      },
      {
        "addressId": 4938,
        "addressName": "长丰县",
        "type": "AREA",
        "parentAddressId": 3098
      },
      {
        "addressId": 4939,
        "addressName": "肥东县",
        "type": "AREA",
        "parentAddressId": 3098
      },
      {
        "addressId": 4940,
        "addressName": "肥西县",
        "type": "AREA",
        "parentAddressId": 3098
      },
      {
        "addressId": 4941,
        "addressName": "镜湖区",
        "type": "AREA",
        "parentAddressId": 3099
      },
      {
        "addressId": 4942,
        "addressName": "马塘区",
        "type": "AREA",
        "parentAddressId": 3099
      },
      {
        "addressId": 4943,
        "addressName": "新芜区",
        "type": "AREA",
        "parentAddressId": 3099
      },
      {
        "addressId": 4944,
        "addressName": "鸠江区",
        "type": "AREA",
        "parentAddressId": 3099
      },
      {
        "addressId": 4945,
        "addressName": "芜湖县",
        "type": "AREA",
        "parentAddressId": 3099
      },
      {
        "addressId": 4946,
        "addressName": "繁昌县",
        "type": "AREA",
        "parentAddressId": 3099
      },
      {
        "addressId": 4947,
        "addressName": "南陵县",
        "type": "AREA",
        "parentAddressId": 3099
      },
      {
        "addressId": 4948,
        "addressName": "龙子湖区",
        "type": "AREA",
        "parentAddressId": 3100
      },
      {
        "addressId": 4949,
        "addressName": "蚌山区",
        "type": "AREA",
        "parentAddressId": 3100
      },
      {
        "addressId": 4950,
        "addressName": "禹会区",
        "type": "AREA",
        "parentAddressId": 3100
      },
      {
        "addressId": 4951,
        "addressName": "淮上区",
        "type": "AREA",
        "parentAddressId": 3100
      },
      {
        "addressId": 4952,
        "addressName": "怀远县",
        "type": "AREA",
        "parentAddressId": 3100
      },
      {
        "addressId": 4953,
        "addressName": "五河县",
        "type": "AREA",
        "parentAddressId": 3100
      },
      {
        "addressId": 4954,
        "addressName": "固镇县",
        "type": "AREA",
        "parentAddressId": 3100
      },
      {
        "addressId": 4955,
        "addressName": "大通区",
        "type": "AREA",
        "parentAddressId": 3101
      },
      {
        "addressId": 4956,
        "addressName": "田家庵区",
        "type": "AREA",
        "parentAddressId": 3101
      },
      {
        "addressId": 4957,
        "addressName": "谢家集区",
        "type": "AREA",
        "parentAddressId": 3101
      },
      {
        "addressId": 4958,
        "addressName": "八公山区",
        "type": "AREA",
        "parentAddressId": 3101
      },
      {
        "addressId": 4959,
        "addressName": "潘集区",
        "type": "AREA",
        "parentAddressId": 3101
      },
      {
        "addressId": 4960,
        "addressName": "凤台县",
        "type": "AREA",
        "parentAddressId": 3101
      },
      {
        "addressId": 4961,
        "addressName": "金家庄区",
        "type": "AREA",
        "parentAddressId": 3102
      },
      {
        "addressId": 4962,
        "addressName": "花山区",
        "type": "AREA",
        "parentAddressId": 3102
      },
      {
        "addressId": 4963,
        "addressName": "雨山区",
        "type": "AREA",
        "parentAddressId": 3102
      },
      {
        "addressId": 4964,
        "addressName": "当涂县",
        "type": "AREA",
        "parentAddressId": 3102
      },
      {
        "addressId": 4965,
        "addressName": "杜集区",
        "type": "AREA",
        "parentAddressId": 3103
      },
      {
        "addressId": 4966,
        "addressName": "相山区",
        "type": "AREA",
        "parentAddressId": 3103
      },
      {
        "addressId": 4967,
        "addressName": "烈山区",
        "type": "AREA",
        "parentAddressId": 3103
      },
      {
        "addressId": 4968,
        "addressName": "濉溪县",
        "type": "AREA",
        "parentAddressId": 3103
      },
      {
        "addressId": 4969,
        "addressName": "铜官山区",
        "type": "AREA",
        "parentAddressId": 3104
      },
      {
        "addressId": 4970,
        "addressName": "狮子山区",
        "type": "AREA",
        "parentAddressId": 3104
      },
      {
        "addressId": 4971,
        "addressName": "郊区",
        "type": "AREA",
        "parentAddressId": 3104
      },
      {
        "addressId": 4972,
        "addressName": "铜陵县",
        "type": "AREA",
        "parentAddressId": 3104
      },
      {
        "addressId": 4973,
        "addressName": "迎江区",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4974,
        "addressName": "大观区",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4975,
        "addressName": "郊区",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4976,
        "addressName": "怀宁县",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4977,
        "addressName": "枞阳县",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4978,
        "addressName": "潜山县",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4979,
        "addressName": "太湖县",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4980,
        "addressName": "宿松县",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4981,
        "addressName": "望江县",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4982,
        "addressName": "岳西县",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4983,
        "addressName": "桐城市",
        "type": "AREA",
        "parentAddressId": 3105
      },
      {
        "addressId": 4984,
        "addressName": "屯溪区",
        "type": "AREA",
        "parentAddressId": 3106
      },
      {
        "addressId": 4985,
        "addressName": "黄山区",
        "type": "AREA",
        "parentAddressId": 3106
      },
      {
        "addressId": 4986,
        "addressName": "徽州区",
        "type": "AREA",
        "parentAddressId": 3106
      },
      {
        "addressId": 4987,
        "addressName": "歙县",
        "type": "AREA",
        "parentAddressId": 3106
      },
      {
        "addressId": 4988,
        "addressName": "休宁县",
        "type": "AREA",
        "parentAddressId": 3106
      },
      {
        "addressId": 4989,
        "addressName": "黟县",
        "type": "AREA",
        "parentAddressId": 3106
      },
      {
        "addressId": 4990,
        "addressName": "祁门县",
        "type": "AREA",
        "parentAddressId": 3106
      },
      {
        "addressId": 4991,
        "addressName": "琅琊区",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4992,
        "addressName": "南谯区",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4993,
        "addressName": "来安县",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4994,
        "addressName": "全椒县",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4995,
        "addressName": "定远县",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4996,
        "addressName": "凤阳县",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4997,
        "addressName": "天长市",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4998,
        "addressName": "明光市",
        "type": "AREA",
        "parentAddressId": 3107
      },
      {
        "addressId": 4999,
        "addressName": "颍州区",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5000,
        "addressName": "颍东区",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5001,
        "addressName": "颍泉区",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5002,
        "addressName": "临泉县",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5003,
        "addressName": "太和县",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5004,
        "addressName": "阜南县",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5005,
        "addressName": "颍上县",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5006,
        "addressName": "界首市",
        "type": "AREA",
        "parentAddressId": 3108
      },
      {
        "addressId": 5007,
        "addressName": "埇桥区",
        "type": "AREA",
        "parentAddressId": 3109
      },
      {
        "addressId": 5008,
        "addressName": "砀山县",
        "type": "AREA",
        "parentAddressId": 3109
      },
      {
        "addressId": 5009,
        "addressName": "萧县",
        "type": "AREA",
        "parentAddressId": 3109
      },
      {
        "addressId": 5010,
        "addressName": "灵璧县",
        "type": "AREA",
        "parentAddressId": 3109
      },
      {
        "addressId": 5011,
        "addressName": "泗县",
        "type": "AREA",
        "parentAddressId": 3109
      },
      {
        "addressId": 5012,
        "addressName": "居巢区",
        "type": "AREA",
        "parentAddressId": 3110
      },
      {
        "addressId": 5013,
        "addressName": "庐江县",
        "type": "AREA",
        "parentAddressId": 3110
      },
      {
        "addressId": 5014,
        "addressName": "无为县",
        "type": "AREA",
        "parentAddressId": 3110
      },
      {
        "addressId": 5015,
        "addressName": "含山县",
        "type": "AREA",
        "parentAddressId": 3110
      },
      {
        "addressId": 5016,
        "addressName": "和县",
        "type": "AREA",
        "parentAddressId": 3110
      },
      {
        "addressId": 5017,
        "addressName": "金安区",
        "type": "AREA",
        "parentAddressId": 3111
      },
      {
        "addressId": 5018,
        "addressName": "裕安区",
        "type": "AREA",
        "parentAddressId": 3111
      },
      {
        "addressId": 5019,
        "addressName": "寿县",
        "type": "AREA",
        "parentAddressId": 3111
      },
      {
        "addressId": 5020,
        "addressName": "霍邱县",
        "type": "AREA",
        "parentAddressId": 3111
      },
      {
        "addressId": 5021,
        "addressName": "舒城县",
        "type": "AREA",
        "parentAddressId": 3111
      },
      {
        "addressId": 5022,
        "addressName": "金寨县",
        "type": "AREA",
        "parentAddressId": 3111
      },
      {
        "addressId": 5023,
        "addressName": "霍山县",
        "type": "AREA",
        "parentAddressId": 3111
      },
      {
        "addressId": 5024,
        "addressName": "谯城区",
        "type": "AREA",
        "parentAddressId": 3112
      },
      {
        "addressId": 5025,
        "addressName": "涡阳县",
        "type": "AREA",
        "parentAddressId": 3112
      },
      {
        "addressId": 5026,
        "addressName": "蒙城县",
        "type": "AREA",
        "parentAddressId": 3112
      },
      {
        "addressId": 5027,
        "addressName": "利辛县",
        "type": "AREA",
        "parentAddressId": 3112
      },
      {
        "addressId": 5028,
        "addressName": "贵池区",
        "type": "AREA",
        "parentAddressId": 3113
      },
      {
        "addressId": 5029,
        "addressName": "东至县",
        "type": "AREA",
        "parentAddressId": 3113
      },
      {
        "addressId": 5030,
        "addressName": "石台县",
        "type": "AREA",
        "parentAddressId": 3113
      },
      {
        "addressId": 5031,
        "addressName": "青阳县",
        "type": "AREA",
        "parentAddressId": 3113
      },
      {
        "addressId": 5032,
        "addressName": "宣州区",
        "type": "AREA",
        "parentAddressId": 3114
      },
      {
        "addressId": 5033,
        "addressName": "郎溪县",
        "type": "AREA",
        "parentAddressId": 3114
      },
      {
        "addressId": 5034,
        "addressName": "广德县",
        "type": "AREA",
        "parentAddressId": 3114
      },
      {
        "addressId": 5035,
        "addressName": "泾县",
        "type": "AREA",
        "parentAddressId": 3114
      },
      {
        "addressId": 5036,
        "addressName": "绩溪县",
        "type": "AREA",
        "parentAddressId": 3114
      },
      {
        "addressId": 5037,
        "addressName": "旌德县",
        "type": "AREA",
        "parentAddressId": 3114
      },
      {
        "addressId": 5038,
        "addressName": "宁国市",
        "type": "AREA",
        "parentAddressId": 3114
      },
      {
        "addressId": 5039,
        "addressName": "鼓楼区",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5040,
        "addressName": "台江区",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5041,
        "addressName": "仓山区",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5042,
        "addressName": "马尾区",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5043,
        "addressName": "晋安区",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5044,
        "addressName": "闽侯县",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5045,
        "addressName": "连江县",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5046,
        "addressName": "罗源县",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5047,
        "addressName": "闽清县",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5048,
        "addressName": "永泰县",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5049,
        "addressName": "平潭县",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5050,
        "addressName": "福清市",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5051,
        "addressName": "长乐市",
        "type": "AREA",
        "parentAddressId": 3115
      },
      {
        "addressId": 5052,
        "addressName": "思明区",
        "type": "AREA",
        "parentAddressId": 3116
      },
      {
        "addressId": 5053,
        "addressName": "海沧区",
        "type": "AREA",
        "parentAddressId": 3116
      },
      {
        "addressId": 5054,
        "addressName": "湖里区",
        "type": "AREA",
        "parentAddressId": 3116
      },
      {
        "addressId": 5055,
        "addressName": "集美区",
        "type": "AREA",
        "parentAddressId": 3116
      },
      {
        "addressId": 5056,
        "addressName": "同安区",
        "type": "AREA",
        "parentAddressId": 3116
      },
      {
        "addressId": 5057,
        "addressName": "翔安区",
        "type": "AREA",
        "parentAddressId": 3116
      },
      {
        "addressId": 5058,
        "addressName": "城厢区",
        "type": "AREA",
        "parentAddressId": 3117
      },
      {
        "addressId": 5059,
        "addressName": "涵江区",
        "type": "AREA",
        "parentAddressId": 3117
      },
      {
        "addressId": 5060,
        "addressName": "荔城区",
        "type": "AREA",
        "parentAddressId": 3117
      },
      {
        "addressId": 5061,
        "addressName": "秀屿区",
        "type": "AREA",
        "parentAddressId": 3117
      },
      {
        "addressId": 5062,
        "addressName": "仙游县",
        "type": "AREA",
        "parentAddressId": 3117
      },
      {
        "addressId": 5063,
        "addressName": "梅列区",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5382,
        "addressName": "尉氏县",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5383,
        "addressName": "开封县",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5384,
        "addressName": "兰考县",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5385,
        "addressName": "老城区",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5386,
        "addressName": "西工区",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5387,
        "addressName": "廛河回族区",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5388,
        "addressName": "涧西区",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5389,
        "addressName": "吉利区",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5390,
        "addressName": "洛龙区",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5391,
        "addressName": "孟津县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5392,
        "addressName": "新安县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5393,
        "addressName": "栾川县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5394,
        "addressName": "嵩县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5395,
        "addressName": "汝阳县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5396,
        "addressName": "宜阳县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5397,
        "addressName": "洛宁县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5398,
        "addressName": "伊川县",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5399,
        "addressName": "偃师市",
        "type": "AREA",
        "parentAddressId": 3154
      },
      {
        "addressId": 5400,
        "addressName": "新华区",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5401,
        "addressName": "卫东区",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5402,
        "addressName": "石龙区",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5403,
        "addressName": "湛河区",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5404,
        "addressName": "宝丰县",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5405,
        "addressName": "叶县",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5406,
        "addressName": "鲁山县",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5407,
        "addressName": "郏县",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5408,
        "addressName": "舞钢市",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5409,
        "addressName": "汝州市",
        "type": "AREA",
        "parentAddressId": 3155
      },
      {
        "addressId": 5410,
        "addressName": "文峰区",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5411,
        "addressName": "北关区",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5412,
        "addressName": "殷都区",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5413,
        "addressName": "龙安区",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5414,
        "addressName": "安阳县",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5415,
        "addressName": "汤阴县",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5416,
        "addressName": "滑县",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5417,
        "addressName": "内黄县",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5418,
        "addressName": "林州市",
        "type": "AREA",
        "parentAddressId": 3156
      },
      {
        "addressId": 5419,
        "addressName": "鹤山区",
        "type": "AREA",
        "parentAddressId": 3157
      },
      {
        "addressId": 5420,
        "addressName": "山城区",
        "type": "AREA",
        "parentAddressId": 3157
      },
      {
        "addressId": 5421,
        "addressName": "淇滨区",
        "type": "AREA",
        "parentAddressId": 3157
      },
      {
        "addressId": 5422,
        "addressName": "浚县",
        "type": "AREA",
        "parentAddressId": 3157
      },
      {
        "addressId": 5423,
        "addressName": "淇县",
        "type": "AREA",
        "parentAddressId": 3157
      },
      {
        "addressId": 5424,
        "addressName": "红旗区",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5425,
        "addressName": "卫滨区",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5426,
        "addressName": "凤泉区",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5427,
        "addressName": "牧野区",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5428,
        "addressName": "新乡县",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5429,
        "addressName": "获嘉县",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5430,
        "addressName": "原阳县",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5431,
        "addressName": "延津县",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5432,
        "addressName": "封丘县",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5433,
        "addressName": "长垣县",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5434,
        "addressName": "卫辉市",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5435,
        "addressName": "辉县市",
        "type": "AREA",
        "parentAddressId": 3158
      },
      {
        "addressId": 5436,
        "addressName": "解放区",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5437,
        "addressName": "中站区",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5438,
        "addressName": "马村区",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5439,
        "addressName": "山阳区",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5440,
        "addressName": "修武县",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5441,
        "addressName": "博爱县",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5442,
        "addressName": "武陟县",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5443,
        "addressName": "温县",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5444,
        "addressName": "济源市",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5445,
        "addressName": "沁阳市",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5446,
        "addressName": "孟州市",
        "type": "AREA",
        "parentAddressId": 3159
      },
      {
        "addressId": 5447,
        "addressName": "华龙区",
        "type": "AREA",
        "parentAddressId": 3160
      },
      {
        "addressId": 5448,
        "addressName": "清丰县",
        "type": "AREA",
        "parentAddressId": 3160
      },
      {
        "addressId": 5449,
        "addressName": "南乐县",
        "type": "AREA",
        "parentAddressId": 3160
      },
      {
        "addressId": 5450,
        "addressName": "范县",
        "type": "AREA",
        "parentAddressId": 3160
      },
      {
        "addressId": 5451,
        "addressName": "台前县",
        "type": "AREA",
        "parentAddressId": 3160
      },
      {
        "addressId": 5452,
        "addressName": "濮阳县",
        "type": "AREA",
        "parentAddressId": 3160
      },
      {
        "addressId": 5453,
        "addressName": "魏都区",
        "type": "AREA",
        "parentAddressId": 3161
      },
      {
        "addressId": 5454,
        "addressName": "许昌县",
        "type": "AREA",
        "parentAddressId": 3161
      },
      {
        "addressId": 5455,
        "addressName": "鄢陵县",
        "type": "AREA",
        "parentAddressId": 3161
      },
      {
        "addressId": 5456,
        "addressName": "襄城县",
        "type": "AREA",
        "parentAddressId": 3161
      },
      {
        "addressId": 5457,
        "addressName": "禹州市",
        "type": "AREA",
        "parentAddressId": 3161
      },
      {
        "addressId": 5458,
        "addressName": "长葛市",
        "type": "AREA",
        "parentAddressId": 3161
      },
      {
        "addressId": 5459,
        "addressName": "源汇区",
        "type": "AREA",
        "parentAddressId": 3162
      },
      {
        "addressId": 5460,
        "addressName": "郾城区",
        "type": "AREA",
        "parentAddressId": 3162
      },
      {
        "addressId": 5461,
        "addressName": "召陵区",
        "type": "AREA",
        "parentAddressId": 3162
      },
      {
        "addressId": 5462,
        "addressName": "舞阳县",
        "type": "AREA",
        "parentAddressId": 3162
      },
      {
        "addressId": 5463,
        "addressName": "临颍县",
        "type": "AREA",
        "parentAddressId": 3162
      },
      {
        "addressId": 5464,
        "addressName": "市辖区",
        "type": "AREA",
        "parentAddressId": 3163
      },
      {
        "addressId": 5465,
        "addressName": "湖滨区",
        "type": "AREA",
        "parentAddressId": 3163
      },
      {
        "addressId": 5466,
        "addressName": "渑池县",
        "type": "AREA",
        "parentAddressId": 3163
      },
      {
        "addressId": 5467,
        "addressName": "陕县",
        "type": "AREA",
        "parentAddressId": 3163
      },
      {
        "addressId": 5468,
        "addressName": "卢氏县",
        "type": "AREA",
        "parentAddressId": 3163
      },
      {
        "addressId": 5469,
        "addressName": "义马市",
        "type": "AREA",
        "parentAddressId": 3163
      },
      {
        "addressId": 5470,
        "addressName": "灵宝市",
        "type": "AREA",
        "parentAddressId": 3163
      },
      {
        "addressId": 5471,
        "addressName": "宛城区",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5472,
        "addressName": "卧龙区",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5473,
        "addressName": "南召县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5474,
        "addressName": "方城县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5475,
        "addressName": "西峡县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5476,
        "addressName": "镇平县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5477,
        "addressName": "内乡县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5478,
        "addressName": "淅川县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5479,
        "addressName": "社旗县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5480,
        "addressName": "唐河县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5481,
        "addressName": "新野县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5482,
        "addressName": "桐柏县",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5483,
        "addressName": "邓州市",
        "type": "AREA",
        "parentAddressId": 3164
      },
      {
        "addressId": 5484,
        "addressName": "梁园区",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5485,
        "addressName": "睢阳区",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5486,
        "addressName": "民权县",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5064,
        "addressName": "三元区",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5065,
        "addressName": "明溪县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5066,
        "addressName": "清流县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5067,
        "addressName": "宁化县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5068,
        "addressName": "大田县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5069,
        "addressName": "尤溪县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5070,
        "addressName": "沙县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5071,
        "addressName": "将乐县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5072,
        "addressName": "泰宁县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5073,
        "addressName": "建宁县",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5074,
        "addressName": "永安市",
        "type": "AREA",
        "parentAddressId": 3118
      },
      {
        "addressId": 5075,
        "addressName": "鲤城区",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5076,
        "addressName": "丰泽区",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5077,
        "addressName": "洛江区",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5078,
        "addressName": "泉港区",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5079,
        "addressName": "惠安县",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5080,
        "addressName": "安溪县",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5081,
        "addressName": "永春县",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5082,
        "addressName": "德化县",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5083,
        "addressName": "金门县",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5084,
        "addressName": "石狮市",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5085,
        "addressName": "晋江市",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5086,
        "addressName": "南安市",
        "type": "AREA",
        "parentAddressId": 3119
      },
      {
        "addressId": 5087,
        "addressName": "芗城区",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5088,
        "addressName": "龙文区",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5089,
        "addressName": "云霄县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5090,
        "addressName": "漳浦县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5091,
        "addressName": "诏安县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5092,
        "addressName": "长泰县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5093,
        "addressName": "东山县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5094,
        "addressName": "南靖县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5095,
        "addressName": "平和县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5096,
        "addressName": "华安县",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5097,
        "addressName": "龙海市",
        "type": "AREA",
        "parentAddressId": 3120
      },
      {
        "addressId": 5098,
        "addressName": "延平区",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5099,
        "addressName": "顺昌县",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5100,
        "addressName": "浦城县",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5101,
        "addressName": "光泽县",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5102,
        "addressName": "松溪县",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5103,
        "addressName": "政和县",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5104,
        "addressName": "邵武市",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5105,
        "addressName": "武夷山市",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5106,
        "addressName": "建瓯市",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5107,
        "addressName": "建阳市",
        "type": "AREA",
        "parentAddressId": 3121
      },
      {
        "addressId": 5108,
        "addressName": "新罗区",
        "type": "AREA",
        "parentAddressId": 3122
      },
      {
        "addressId": 5109,
        "addressName": "长汀县",
        "type": "AREA",
        "parentAddressId": 3122
      },
      {
        "addressId": 5110,
        "addressName": "永定县",
        "type": "AREA",
        "parentAddressId": 3122
      },
      {
        "addressId": 5111,
        "addressName": "上杭县",
        "type": "AREA",
        "parentAddressId": 3122
      },
      {
        "addressId": 5112,
        "addressName": "武平县",
        "type": "AREA",
        "parentAddressId": 3122
      },
      {
        "addressId": 5113,
        "addressName": "连城县",
        "type": "AREA",
        "parentAddressId": 3122
      },
      {
        "addressId": 5114,
        "addressName": "漳平市",
        "type": "AREA",
        "parentAddressId": 3122
      },
      {
        "addressId": 5115,
        "addressName": "蕉城区",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5116,
        "addressName": "霞浦县",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5117,
        "addressName": "古田县",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5118,
        "addressName": "屏南县",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5119,
        "addressName": "寿宁县",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5120,
        "addressName": "周宁县",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5121,
        "addressName": "柘荣县",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5122,
        "addressName": "福安市",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5123,
        "addressName": "福鼎市",
        "type": "AREA",
        "parentAddressId": 3123
      },
      {
        "addressId": 5124,
        "addressName": "东湖区",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5125,
        "addressName": "西湖区",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5126,
        "addressName": "青云谱区",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5127,
        "addressName": "湾里区",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5128,
        "addressName": "青山湖区",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5129,
        "addressName": "南昌县",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5130,
        "addressName": "新建县",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5131,
        "addressName": "安义县",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5132,
        "addressName": "进贤县",
        "type": "AREA",
        "parentAddressId": 3124
      },
      {
        "addressId": 5133,
        "addressName": "昌江区",
        "type": "AREA",
        "parentAddressId": 3125
      },
      {
        "addressId": 5134,
        "addressName": "珠山区",
        "type": "AREA",
        "parentAddressId": 3125
      },
      {
        "addressId": 5135,
        "addressName": "浮梁县",
        "type": "AREA",
        "parentAddressId": 3125
      },
      {
        "addressId": 5136,
        "addressName": "乐平市",
        "type": "AREA",
        "parentAddressId": 3125
      },
      {
        "addressId": 5137,
        "addressName": "安源区",
        "type": "AREA",
        "parentAddressId": 3126
      },
      {
        "addressId": 5138,
        "addressName": "湘东区",
        "type": "AREA",
        "parentAddressId": 3126
      },
      {
        "addressId": 5139,
        "addressName": "莲花县",
        "type": "AREA",
        "parentAddressId": 3126
      },
      {
        "addressId": 5140,
        "addressName": "上栗县",
        "type": "AREA",
        "parentAddressId": 3126
      },
      {
        "addressId": 5141,
        "addressName": "芦溪县",
        "type": "AREA",
        "parentAddressId": 3126
      },
      {
        "addressId": 5142,
        "addressName": "庐山区",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5143,
        "addressName": "浔阳区",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5144,
        "addressName": "九江县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5145,
        "addressName": "武宁县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5146,
        "addressName": "修水县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5147,
        "addressName": "永修县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5148,
        "addressName": "德安县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5149,
        "addressName": "星子县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5150,
        "addressName": "都昌县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5151,
        "addressName": "湖口县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5152,
        "addressName": "彭泽县",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5153,
        "addressName": "瑞昌市",
        "type": "AREA",
        "parentAddressId": 3127
      },
      {
        "addressId": 5154,
        "addressName": "渝水区",
        "type": "AREA",
        "parentAddressId": 3128
      },
      {
        "addressId": 5155,
        "addressName": "分宜县",
        "type": "AREA",
        "parentAddressId": 3128
      },
      {
        "addressId": 5156,
        "addressName": "月湖区",
        "type": "AREA",
        "parentAddressId": 3129
      },
      {
        "addressId": 5157,
        "addressName": "余江县",
        "type": "AREA",
        "parentAddressId": 3129
      },
      {
        "addressId": 5158,
        "addressName": "贵溪市",
        "type": "AREA",
        "parentAddressId": 3129
      },
      {
        "addressId": 5159,
        "addressName": "章贡区",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5160,
        "addressName": "赣县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5161,
        "addressName": "信丰县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5162,
        "addressName": "大余县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5163,
        "addressName": "上犹县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5164,
        "addressName": "崇义县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5165,
        "addressName": "安远县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5166,
        "addressName": "龙南县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5167,
        "addressName": "定南县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5168,
        "addressName": "全南县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5169,
        "addressName": "宁都县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5170,
        "addressName": "于都县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5171,
        "addressName": "兴国县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5172,
        "addressName": "会昌县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5173,
        "addressName": "寻乌县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5174,
        "addressName": "石城县",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5175,
        "addressName": "瑞金市",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5176,
        "addressName": "南康市",
        "type": "AREA",
        "parentAddressId": 3130
      },
      {
        "addressId": 5177,
        "addressName": "吉州区",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5178,
        "addressName": "青原区",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5179,
        "addressName": "吉安县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5180,
        "addressName": "吉水县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5181,
        "addressName": "峡江县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5182,
        "addressName": "新干县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5183,
        "addressName": "永丰县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5184,
        "addressName": "泰和县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5185,
        "addressName": "遂川县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5186,
        "addressName": "万安县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5187,
        "addressName": "安福县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5188,
        "addressName": "永新县",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5189,
        "addressName": "井冈山市",
        "type": "AREA",
        "parentAddressId": 3131
      },
      {
        "addressId": 5190,
        "addressName": "袁州区",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5191,
        "addressName": "奉新县",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5192,
        "addressName": "万载县",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5193,
        "addressName": "上高县",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5194,
        "addressName": "宜丰县",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5195,
        "addressName": "靖安县",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5196,
        "addressName": "铜鼓县",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5197,
        "addressName": "丰城市",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5198,
        "addressName": "樟树市",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5199,
        "addressName": "高安市",
        "type": "AREA",
        "parentAddressId": 3132
      },
      {
        "addressId": 5200,
        "addressName": "临川区",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5201,
        "addressName": "南城县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5202,
        "addressName": "黎川县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5203,
        "addressName": "南丰县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5204,
        "addressName": "崇仁县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5205,
        "addressName": "乐安县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5206,
        "addressName": "宜黄县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5207,
        "addressName": "金溪县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5208,
        "addressName": "资溪县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5209,
        "addressName": "东乡县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5210,
        "addressName": "广昌县",
        "type": "AREA",
        "parentAddressId": 3133
      },
      {
        "addressId": 5211,
        "addressName": "信州区",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5212,
        "addressName": "上饶县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5213,
        "addressName": "广丰县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5214,
        "addressName": "玉山县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5215,
        "addressName": "铅山县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5216,
        "addressName": "横峰县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5217,
        "addressName": "弋阳县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5218,
        "addressName": "余干县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5219,
        "addressName": "鄱阳县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5220,
        "addressName": "万年县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5221,
        "addressName": "婺源县",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5222,
        "addressName": "德兴市",
        "type": "AREA",
        "parentAddressId": 3134
      },
      {
        "addressId": 5223,
        "addressName": "历下区",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5224,
        "addressName": "市中区",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5225,
        "addressName": "槐荫区",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5226,
        "addressName": "天桥区",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5227,
        "addressName": "历城区",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5228,
        "addressName": "长清区",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5229,
        "addressName": "平阴县",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5230,
        "addressName": "济阳县",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5231,
        "addressName": "商河县",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5232,
        "addressName": "章丘市",
        "type": "AREA",
        "parentAddressId": 3135
      },
      {
        "addressId": 5233,
        "addressName": "市南区",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5234,
        "addressName": "市北区",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5235,
        "addressName": "四方区",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5236,
        "addressName": "黄岛区",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5237,
        "addressName": "崂山区",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5238,
        "addressName": "李沧区",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5239,
        "addressName": "城阳区",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5240,
        "addressName": "胶州市",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5241,
        "addressName": "即墨市",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5242,
        "addressName": "平度市",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5243,
        "addressName": "胶南市",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5244,
        "addressName": "莱西市",
        "type": "AREA",
        "parentAddressId": 3136
      },
      {
        "addressId": 5245,
        "addressName": "淄川区",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5246,
        "addressName": "张店区",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5247,
        "addressName": "博山区",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5248,
        "addressName": "临淄区",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5249,
        "addressName": "周村区",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5250,
        "addressName": "桓台县",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5251,
        "addressName": "高青县",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5252,
        "addressName": "沂源县",
        "type": "AREA",
        "parentAddressId": 3137
      },
      {
        "addressId": 5253,
        "addressName": "市中区",
        "type": "AREA",
        "parentAddressId": 3138
      },
      {
        "addressId": 5254,
        "addressName": "薛城区",
        "type": "AREA",
        "parentAddressId": 3138
      },
      {
        "addressId": 5255,
        "addressName": "峄城区",
        "type": "AREA",
        "parentAddressId": 3138
      },
      {
        "addressId": 5256,
        "addressName": "台儿庄区",
        "type": "AREA",
        "parentAddressId": 3138
      },
      {
        "addressId": 5257,
        "addressName": "山亭区",
        "type": "AREA",
        "parentAddressId": 3138
      },
      {
        "addressId": 5258,
        "addressName": "滕州市",
        "type": "AREA",
        "parentAddressId": 3138
      },
      {
        "addressId": 5259,
        "addressName": "东营区",
        "type": "AREA",
        "parentAddressId": 3139
      },
      {
        "addressId": 5260,
        "addressName": "河口区",
        "type": "AREA",
        "parentAddressId": 3139
      },
      {
        "addressId": 5261,
        "addressName": "垦利县",
        "type": "AREA",
        "parentAddressId": 3139
      },
      {
        "addressId": 5262,
        "addressName": "利津县",
        "type": "AREA",
        "parentAddressId": 3139
      },
      {
        "addressId": 5263,
        "addressName": "广饶县",
        "type": "AREA",
        "parentAddressId": 3139
      },
      {
        "addressId": 5264,
        "addressName": "芝罘区",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5265,
        "addressName": "福山区",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5266,
        "addressName": "牟平区",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5267,
        "addressName": "莱山区",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5268,
        "addressName": "长岛县",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5269,
        "addressName": "龙口市",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5270,
        "addressName": "莱阳市",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5271,
        "addressName": "莱州市",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5272,
        "addressName": "蓬莱市",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5273,
        "addressName": "招远市",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5274,
        "addressName": "栖霞市",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5275,
        "addressName": "海阳市",
        "type": "AREA",
        "parentAddressId": 3140
      },
      {
        "addressId": 5276,
        "addressName": "潍城区",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5277,
        "addressName": "寒亭区",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5278,
        "addressName": "坊子区",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5279,
        "addressName": "奎文区",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5280,
        "addressName": "临朐县",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5281,
        "addressName": "昌乐县",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5282,
        "addressName": "青州市",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5283,
        "addressName": "诸城市",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5284,
        "addressName": "寿光市",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5285,
        "addressName": "安丘市",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5286,
        "addressName": "高密市",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5287,
        "addressName": "昌邑市",
        "type": "AREA",
        "parentAddressId": 3141
      },
      {
        "addressId": 5288,
        "addressName": "市中区",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5289,
        "addressName": "任城区",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5290,
        "addressName": "微山县",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5291,
        "addressName": "鱼台县",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5292,
        "addressName": "金乡县",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5293,
        "addressName": "嘉祥县",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5294,
        "addressName": "汶上县",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5295,
        "addressName": "泗水县",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5296,
        "addressName": "梁山县",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5297,
        "addressName": "曲阜市",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5298,
        "addressName": "兖州市",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5299,
        "addressName": "邹城市",
        "type": "AREA",
        "parentAddressId": 3142
      },
      {
        "addressId": 5300,
        "addressName": "泰山区",
        "type": "AREA",
        "parentAddressId": 3143
      },
      {
        "addressId": 5301,
        "addressName": "岱岳区",
        "type": "AREA",
        "parentAddressId": 3143
      },
      {
        "addressId": 5302,
        "addressName": "宁阳县",
        "type": "AREA",
        "parentAddressId": 3143
      },
      {
        "addressId": 5303,
        "addressName": "东平县",
        "type": "AREA",
        "parentAddressId": 3143
      },
      {
        "addressId": 5304,
        "addressName": "新泰市",
        "type": "AREA",
        "parentAddressId": 3143
      },
      {
        "addressId": 5305,
        "addressName": "肥城市",
        "type": "AREA",
        "parentAddressId": 3143
      },
      {
        "addressId": 5306,
        "addressName": "环翠区",
        "type": "AREA",
        "parentAddressId": 3144
      },
      {
        "addressId": 5307,
        "addressName": "文登市",
        "type": "AREA",
        "parentAddressId": 3144
      },
      {
        "addressId": 5308,
        "addressName": "荣成市",
        "type": "AREA",
        "parentAddressId": 3144
      },
      {
        "addressId": 5309,
        "addressName": "乳山市",
        "type": "AREA",
        "parentAddressId": 3144
      },
      {
        "addressId": 5310,
        "addressName": "东港区",
        "type": "AREA",
        "parentAddressId": 3145
      },
      {
        "addressId": 5311,
        "addressName": "岚山区",
        "type": "AREA",
        "parentAddressId": 3145
      },
      {
        "addressId": 5312,
        "addressName": "五莲县",
        "type": "AREA",
        "parentAddressId": 3145
      },
      {
        "addressId": 5313,
        "addressName": "莒县",
        "type": "AREA",
        "parentAddressId": 3145
      },
      {
        "addressId": 5314,
        "addressName": "莱城区",
        "type": "AREA",
        "parentAddressId": 3146
      },
      {
        "addressId": 5315,
        "addressName": "钢城区",
        "type": "AREA",
        "parentAddressId": 3146
      },
      {
        "addressId": 5316,
        "addressName": "兰山区",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5317,
        "addressName": "罗庄区",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5318,
        "addressName": "河东区",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5319,
        "addressName": "沂南县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5320,
        "addressName": "郯城县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5321,
        "addressName": "沂水县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5322,
        "addressName": "苍山县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5323,
        "addressName": "费县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5324,
        "addressName": "平邑县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5325,
        "addressName": "莒南县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5326,
        "addressName": "蒙阴县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5327,
        "addressName": "临沭县",
        "type": "AREA",
        "parentAddressId": 3147
      },
      {
        "addressId": 5328,
        "addressName": "德城区",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5329,
        "addressName": "陵县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5330,
        "addressName": "宁津县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5331,
        "addressName": "庆云县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5332,
        "addressName": "临邑县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5333,
        "addressName": "齐河县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5334,
        "addressName": "平原县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5335,
        "addressName": "夏津县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5336,
        "addressName": "武城县",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5337,
        "addressName": "乐陵市",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5338,
        "addressName": "禹城市",
        "type": "AREA",
        "parentAddressId": 3148
      },
      {
        "addressId": 5339,
        "addressName": "东昌府区",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5340,
        "addressName": "阳谷县",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5341,
        "addressName": "莘县",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5342,
        "addressName": "茌平县",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5343,
        "addressName": "东阿县",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5344,
        "addressName": "冠县",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5345,
        "addressName": "高唐县",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5346,
        "addressName": "临清市",
        "type": "AREA",
        "parentAddressId": 3149
      },
      {
        "addressId": 5347,
        "addressName": "滨城区",
        "type": "AREA",
        "parentAddressId": 3150
      },
      {
        "addressId": 5348,
        "addressName": "惠民县",
        "type": "AREA",
        "parentAddressId": 3150
      },
      {
        "addressId": 5349,
        "addressName": "阳信县",
        "type": "AREA",
        "parentAddressId": 3150
      },
      {
        "addressId": 5350,
        "addressName": "无棣县",
        "type": "AREA",
        "parentAddressId": 3150
      },
      {
        "addressId": 5351,
        "addressName": "沾化县",
        "type": "AREA",
        "parentAddressId": 3150
      },
      {
        "addressId": 5352,
        "addressName": "博兴县",
        "type": "AREA",
        "parentAddressId": 3150
      },
      {
        "addressId": 5353,
        "addressName": "邹平县",
        "type": "AREA",
        "parentAddressId": 3150
      },
      {
        "addressId": 5354,
        "addressName": "牡丹区",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5355,
        "addressName": "曹县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5356,
        "addressName": "单县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5357,
        "addressName": "成武县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5358,
        "addressName": "巨野县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5359,
        "addressName": "郓城县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5360,
        "addressName": "鄄城县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5361,
        "addressName": "定陶县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5362,
        "addressName": "东明县",
        "type": "AREA",
        "parentAddressId": 3151
      },
      {
        "addressId": 5363,
        "addressName": "中原区",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5364,
        "addressName": "二七区",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5365,
        "addressName": "管城回族区",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5366,
        "addressName": "金水区",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5367,
        "addressName": "上街区",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5368,
        "addressName": "惠济区",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5369,
        "addressName": "中牟县",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5370,
        "addressName": "巩义市",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5371,
        "addressName": "荥阳市",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5372,
        "addressName": "新密市",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5373,
        "addressName": "新郑市",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5374,
        "addressName": "登封市",
        "type": "AREA",
        "parentAddressId": 3152
      },
      {
        "addressId": 5375,
        "addressName": "龙亭区",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5376,
        "addressName": "顺河回族区",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5377,
        "addressName": "鼓楼区",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5378,
        "addressName": "南关区",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5379,
        "addressName": "郊区",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5380,
        "addressName": "杞县",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 5381,
        "addressName": "通许县",
        "type": "AREA",
        "parentAddressId": 3153
      },
      {
        "addressId": 4745,
        "addressName": "栖霞区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4746,
        "addressName": "雨花台区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4747,
        "addressName": "江宁区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4748,
        "addressName": "六合区",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4749,
        "addressName": "溧水县",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4750,
        "addressName": "高淳县",
        "type": "AREA",
        "parentAddressId": 3074
      },
      {
        "addressId": 4751,
        "addressName": "崇安区",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4752,
        "addressName": "南长区",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4753,
        "addressName": "北塘区",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4754,
        "addressName": "锡山区",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4755,
        "addressName": "惠山区",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4756,
        "addressName": "滨湖区",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4757,
        "addressName": "江阴市",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4758,
        "addressName": "宜兴市",
        "type": "AREA",
        "parentAddressId": 3075
      },
      {
        "addressId": 4759,
        "addressName": "鼓楼区",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4760,
        "addressName": "云龙区",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4761,
        "addressName": "九里区",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4762,
        "addressName": "贾汪区",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4763,
        "addressName": "泉山区",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4764,
        "addressName": "丰县",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4765,
        "addressName": "沛县",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4766,
        "addressName": "铜山县",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4767,
        "addressName": "睢宁县",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4768,
        "addressName": "新沂市",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4769,
        "addressName": "邳州市",
        "type": "AREA",
        "parentAddressId": 3076
      },
      {
        "addressId": 4770,
        "addressName": "天宁区",
        "type": "AREA",
        "parentAddressId": 3077
      },
      {
        "addressId": 4771,
        "addressName": "钟楼区",
        "type": "AREA",
        "parentAddressId": 3077
      },
      {
        "addressId": 4772,
        "addressName": "戚墅堰区",
        "type": "AREA",
        "parentAddressId": 3077
      },
      {
        "addressId": 4773,
        "addressName": "新北区",
        "type": "AREA",
        "parentAddressId": 3077
      },
      {
        "addressId": 4774,
        "addressName": "武进区",
        "type": "AREA",
        "parentAddressId": 3077
      },
      {
        "addressId": 4775,
        "addressName": "溧阳市",
        "type": "AREA",
        "parentAddressId": 3077
      },
      {
        "addressId": 4776,
        "addressName": "金坛市",
        "type": "AREA",
        "parentAddressId": 3077
      },
      {
        "addressId": 4777,
        "addressName": "沧浪区",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4778,
        "addressName": "平江区",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4779,
        "addressName": "金阊区",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4780,
        "addressName": "虎丘区",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4781,
        "addressName": "吴中区",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4782,
        "addressName": "相城区",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4783,
        "addressName": "常熟市",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4784,
        "addressName": "张家港市",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4785,
        "addressName": "昆山市",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4786,
        "addressName": "吴江市",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4787,
        "addressName": "太仓市",
        "type": "AREA",
        "parentAddressId": 3078
      },
      {
        "addressId": 4788,
        "addressName": "崇川区",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4789,
        "addressName": "港闸区",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4790,
        "addressName": "海安县",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4791,
        "addressName": "如东县",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4792,
        "addressName": "启东市",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4793,
        "addressName": "如皋市",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4794,
        "addressName": "通州市",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4795,
        "addressName": "海门市",
        "type": "AREA",
        "parentAddressId": 3079
      },
      {
        "addressId": 4796,
        "addressName": "连云区",
        "type": "AREA",
        "parentAddressId": 3080
      },
      {
        "addressId": 4797,
        "addressName": "新浦区",
        "type": "AREA",
        "parentAddressId": 3080
      },
      {
        "addressId": 4798,
        "addressName": "海州区",
        "type": "AREA",
        "parentAddressId": 3080
      },
      {
        "addressId": 4799,
        "addressName": "赣榆县",
        "type": "AREA",
        "parentAddressId": 3080
      },
      {
        "addressId": 4800,
        "addressName": "东海县",
        "type": "AREA",
        "parentAddressId": 3080
      },
      {
        "addressId": 4801,
        "addressName": "灌云县",
        "type": "AREA",
        "parentAddressId": 3080
      },
      {
        "addressId": 4802,
        "addressName": "灌南县",
        "type": "AREA",
        "parentAddressId": 3080
      },
      {
        "addressId": 4803,
        "addressName": "清河区",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4804,
        "addressName": "楚州区",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4805,
        "addressName": "淮阴区",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4806,
        "addressName": "清浦区",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4807,
        "addressName": "涟水县",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4808,
        "addressName": "洪泽县",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4809,
        "addressName": "盱眙县",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4810,
        "addressName": "金湖县",
        "type": "AREA",
        "parentAddressId": 3081
      },
      {
        "addressId": 4811,
        "addressName": "亭湖区",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4812,
        "addressName": "盐都区",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4813,
        "addressName": "响水县",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4814,
        "addressName": "滨海县",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4815,
        "addressName": "阜宁县",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4816,
        "addressName": "射阳县",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4817,
        "addressName": "建湖县",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4818,
        "addressName": "东台市",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4819,
        "addressName": "大丰市",
        "type": "AREA",
        "parentAddressId": 3082
      },
      {
        "addressId": 4820,
        "addressName": "广陵区",
        "type": "AREA",
        "parentAddressId": 3083
      },
      {
        "addressId": 4821,
        "addressName": "邗江区",
        "type": "AREA",
        "parentAddressId": 3083
      },
      {
        "addressId": 4822,
        "addressName": "维扬区",
        "type": "AREA",
        "parentAddressId": 3083
      },
      {
        "addressId": 4823,
        "addressName": "宝应县",
        "type": "AREA",
        "parentAddressId": 3083
      },
      {
        "addressId": 4824,
        "addressName": "仪征市",
        "type": "AREA",
        "parentAddressId": 3083
      },
      {
        "addressId": 4825,
        "addressName": "高邮市",
        "type": "AREA",
        "parentAddressId": 3083
      },
      {
        "addressId": 4826,
        "addressName": "江都市",
        "type": "AREA",
        "parentAddressId": 3083
      },
      {
        "addressId": 4827,
        "addressName": "京口区",
        "type": "AREA",
        "parentAddressId": 3084
      },
      {
        "addressId": 4828,
        "addressName": "润州区",
        "type": "AREA",
        "parentAddressId": 3084
      },
      {
        "addressId": 4829,
        "addressName": "丹徒区",
        "type": "AREA",
        "parentAddressId": 3084
      },
      {
        "addressId": 4830,
        "addressName": "丹阳市",
        "type": "AREA",
        "parentAddressId": 3084
      },
      {
        "addressId": 4831,
        "addressName": "扬中市",
        "type": "AREA",
        "parentAddressId": 3084
      },
      {
        "addressId": 4832,
        "addressName": "句容市",
        "type": "AREA",
        "parentAddressId": 3084
      },
      {
        "addressId": 4833,
        "addressName": "海陵区",
        "type": "AREA",
        "parentAddressId": 3085
      },
      {
        "addressId": 4834,
        "addressName": "高港区",
        "type": "AREA",
        "parentAddressId": 3085
      },
      {
        "addressId": 4835,
        "addressName": "兴化市",
        "type": "AREA",
        "parentAddressId": 3085
      },
      {
        "addressId": 4836,
        "addressName": "靖江市",
        "type": "AREA",
        "parentAddressId": 3085
      },
      {
        "addressId": 4837,
        "addressName": "泰兴市",
        "type": "AREA",
        "parentAddressId": 3085
      },
      {
        "addressId": 4838,
        "addressName": "姜堰市",
        "type": "AREA",
        "parentAddressId": 3085
      },
      {
        "addressId": 4839,
        "addressName": "宿城区",
        "type": "AREA",
        "parentAddressId": 3086
      },
      {
        "addressId": 4840,
        "addressName": "宿豫区",
        "type": "AREA",
        "parentAddressId": 3086
      },
      {
        "addressId": 4841,
        "addressName": "沭阳县",
        "type": "AREA",
        "parentAddressId": 3086
      },
      {
        "addressId": 4842,
        "addressName": "泗阳县",
        "type": "AREA",
        "parentAddressId": 3086
      },
      {
        "addressId": 4843,
        "addressName": "泗洪县",
        "type": "AREA",
        "parentAddressId": 3086
      },
      {
        "addressId": 4844,
        "addressName": "上城区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4845,
        "addressName": "下城区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4846,
        "addressName": "江干区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4847,
        "addressName": "拱墅区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4848,
        "addressName": "西湖区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4849,
        "addressName": "滨江区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 4850,
        "addressName": "萧山区",
        "type": "AREA",
        "parentAddressId": 3087
      },
      {
        "addressId": 6216,
        "addressName": "冕宁县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6217,
        "addressName": "越西县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6218,
        "addressName": "甘洛县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6219,
        "addressName": "美姑县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6220,
        "addressName": "雷波县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6221,
        "addressName": "南明区",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6222,
        "addressName": "云岩区",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6223,
        "addressName": "花溪区",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6224,
        "addressName": "乌当区",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6225,
        "addressName": "白云区",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6226,
        "addressName": "小河区",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6227,
        "addressName": "开阳县",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6228,
        "addressName": "息烽县",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6229,
        "addressName": "修文县",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6230,
        "addressName": "清镇市",
        "type": "AREA",
        "parentAddressId": 3256
      },
      {
        "addressId": 6231,
        "addressName": "钟山区",
        "type": "AREA",
        "parentAddressId": 3257
      },
      {
        "addressId": 6232,
        "addressName": "六枝特区",
        "type": "AREA",
        "parentAddressId": 3257
      },
      {
        "addressId": 6233,
        "addressName": "水城县",
        "type": "AREA",
        "parentAddressId": 3257
      },
      {
        "addressId": 6234,
        "addressName": "盘县",
        "type": "AREA",
        "parentAddressId": 3257
      },
      {
        "addressId": 6235,
        "addressName": "红花岗区",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6236,
        "addressName": "汇川区",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6237,
        "addressName": "遵义县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6238,
        "addressName": "桐梓县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6239,
        "addressName": "绥阳县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6240,
        "addressName": "正安县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6241,
        "addressName": "道真仡佬族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6242,
        "addressName": "务川仡佬族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6243,
        "addressName": "凤冈县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6244,
        "addressName": "湄潭县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6245,
        "addressName": "余庆县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6246,
        "addressName": "习水县",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6247,
        "addressName": "赤水市",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6248,
        "addressName": "仁怀市",
        "type": "AREA",
        "parentAddressId": 3258
      },
      {
        "addressId": 6249,
        "addressName": "西秀区",
        "type": "AREA",
        "parentAddressId": 3259
      },
      {
        "addressId": 6250,
        "addressName": "平坝县",
        "type": "AREA",
        "parentAddressId": 3259
      },
      {
        "addressId": 6251,
        "addressName": "普定县",
        "type": "AREA",
        "parentAddressId": 3259
      },
      {
        "addressId": 6252,
        "addressName": "镇宁布依族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3259
      },
      {
        "addressId": 6253,
        "addressName": "关岭布依族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3259
      },
      {
        "addressId": 6254,
        "addressName": "紫云苗族布依族自治县",
        "type": "AREA",
        "parentAddressId": 3259
      },
      {
        "addressId": 6255,
        "addressName": "铜仁市",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6256,
        "addressName": "江口县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6257,
        "addressName": "玉屏侗族自治县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6258,
        "addressName": "石阡县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6259,
        "addressName": "思南县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6260,
        "addressName": "印江土家族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6261,
        "addressName": "德江县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6262,
        "addressName": "沿河土家族自治县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6263,
        "addressName": "松桃苗族自治县",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6264,
        "addressName": "万山特区",
        "type": "AREA",
        "parentAddressId": 3260
      },
      {
        "addressId": 6265,
        "addressName": "兴义市",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6266,
        "addressName": "兴仁县",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6267,
        "addressName": "普安县",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6268,
        "addressName": "晴隆县",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6269,
        "addressName": "贞丰县",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6270,
        "addressName": "望谟县",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6271,
        "addressName": "册亨县",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6272,
        "addressName": "安龙县",
        "type": "AREA",
        "parentAddressId": 3261
      },
      {
        "addressId": 6273,
        "addressName": "毕节市",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6274,
        "addressName": "大方县",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6275,
        "addressName": "黔西县",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6276,
        "addressName": "金沙县",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6277,
        "addressName": "织金县",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6278,
        "addressName": "纳雍县",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6279,
        "addressName": "威宁彝族回族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6280,
        "addressName": "赫章县",
        "type": "AREA",
        "parentAddressId": 3262
      },
      {
        "addressId": 6281,
        "addressName": "凯里市",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6282,
        "addressName": "黄平县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6283,
        "addressName": "施秉县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6284,
        "addressName": "三穗县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6285,
        "addressName": "镇远县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6286,
        "addressName": "岑巩县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6287,
        "addressName": "天柱县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6288,
        "addressName": "锦屏县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6289,
        "addressName": "剑河县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6290,
        "addressName": "台江县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6291,
        "addressName": "黎平县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6292,
        "addressName": "榕江县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6293,
        "addressName": "从江县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6294,
        "addressName": "雷山县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6295,
        "addressName": "麻江县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6296,
        "addressName": "丹寨县",
        "type": "AREA",
        "parentAddressId": 3263
      },
      {
        "addressId": 6297,
        "addressName": "都匀市",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6298,
        "addressName": "福泉市",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6299,
        "addressName": "荔波县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6300,
        "addressName": "贵定县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6301,
        "addressName": "瓮安县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6302,
        "addressName": "独山县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6303,
        "addressName": "平塘县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6304,
        "addressName": "罗甸县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6305,
        "addressName": "长顺县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6306,
        "addressName": "龙里县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6307,
        "addressName": "惠水县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6308,
        "addressName": "三都水族自治县",
        "type": "AREA",
        "parentAddressId": 3264
      },
      {
        "addressId": 6309,
        "addressName": "五华区",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6310,
        "addressName": "盘龙区",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 5487,
        "addressName": "睢县",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5488,
        "addressName": "宁陵县",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5489,
        "addressName": "柘城县",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5490,
        "addressName": "虞城县",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5491,
        "addressName": "夏邑县",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5492,
        "addressName": "永城市",
        "type": "AREA",
        "parentAddressId": 3165
      },
      {
        "addressId": 5493,
        "addressName": "浉河区",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5494,
        "addressName": "平桥区",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5495,
        "addressName": "罗山县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5496,
        "addressName": "光山县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5497,
        "addressName": "新县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5498,
        "addressName": "商城县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5499,
        "addressName": "固始县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5500,
        "addressName": "潢川县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5501,
        "addressName": "淮滨县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5502,
        "addressName": "息县",
        "type": "AREA",
        "parentAddressId": 3166
      },
      {
        "addressId": 5503,
        "addressName": "川汇区",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5504,
        "addressName": "扶沟县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5505,
        "addressName": "西华县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5506,
        "addressName": "商水县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5507,
        "addressName": "沈丘县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5508,
        "addressName": "郸城县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5509,
        "addressName": "淮阳县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5510,
        "addressName": "太康县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5511,
        "addressName": "鹿邑县",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5512,
        "addressName": "项城市",
        "type": "AREA",
        "parentAddressId": 3167
      },
      {
        "addressId": 5513,
        "addressName": "驿城区",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5514,
        "addressName": "西平县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5515,
        "addressName": "上蔡县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5516,
        "addressName": "平舆县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5517,
        "addressName": "正阳县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5518,
        "addressName": "确山县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5519,
        "addressName": "泌阳县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5520,
        "addressName": "汝南县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5521,
        "addressName": "遂平县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5522,
        "addressName": "新蔡县",
        "type": "AREA",
        "parentAddressId": 3168
      },
      {
        "addressId": 5523,
        "addressName": "江岸区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5524,
        "addressName": "江汉区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5525,
        "addressName": "硚口区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5526,
        "addressName": "汉阳区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5527,
        "addressName": "武昌区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5528,
        "addressName": "青山区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5529,
        "addressName": "洪山区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5530,
        "addressName": "东西湖区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5531,
        "addressName": "汉南区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5532,
        "addressName": "蔡甸区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5533,
        "addressName": "江夏区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5534,
        "addressName": "黄陂区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5535,
        "addressName": "新洲区",
        "type": "AREA",
        "parentAddressId": 3169
      },
      {
        "addressId": 5536,
        "addressName": "黄石港区",
        "type": "AREA",
        "parentAddressId": 3170
      },
      {
        "addressId": 5537,
        "addressName": "西塞山区",
        "type": "AREA",
        "parentAddressId": 3170
      },
      {
        "addressId": 5538,
        "addressName": "下陆区",
        "type": "AREA",
        "parentAddressId": 3170
      },
      {
        "addressId": 5539,
        "addressName": "铁山区",
        "type": "AREA",
        "parentAddressId": 3170
      },
      {
        "addressId": 5540,
        "addressName": "阳新县",
        "type": "AREA",
        "parentAddressId": 3170
      },
      {
        "addressId": 5541,
        "addressName": "大冶市",
        "type": "AREA",
        "parentAddressId": 3170
      },
      {
        "addressId": 5542,
        "addressName": "茅箭区",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5543,
        "addressName": "张湾区",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5544,
        "addressName": "郧县",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5545,
        "addressName": "郧西县",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5546,
        "addressName": "竹山县",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5547,
        "addressName": "竹溪县",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5548,
        "addressName": "房县",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5549,
        "addressName": "丹江口市",
        "type": "AREA",
        "parentAddressId": 3171
      },
      {
        "addressId": 5550,
        "addressName": "西陵区",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5551,
        "addressName": "伍家岗区",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5552,
        "addressName": "点军区",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5553,
        "addressName": "猇亭区",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5554,
        "addressName": "夷陵区",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5555,
        "addressName": "远安县",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5556,
        "addressName": "兴山县",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5557,
        "addressName": "秭归县",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5558,
        "addressName": "长阳土家族自治县",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5559,
        "addressName": "五峰土家族自治县",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5560,
        "addressName": "宜都市",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5561,
        "addressName": "当阳市",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5562,
        "addressName": "枝江市",
        "type": "AREA",
        "parentAddressId": 3172
      },
      {
        "addressId": 5563,
        "addressName": "襄城区",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5564,
        "addressName": "樊城区",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5565,
        "addressName": "襄阳区",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5566,
        "addressName": "南漳县",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5567,
        "addressName": "谷城县",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5568,
        "addressName": "保康县",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5569,
        "addressName": "老河口市",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5570,
        "addressName": "枣阳市",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5571,
        "addressName": "宜城市",
        "type": "AREA",
        "parentAddressId": 3173
      },
      {
        "addressId": 5572,
        "addressName": "梁子湖区",
        "type": "AREA",
        "parentAddressId": 3174
      },
      {
        "addressId": 5573,
        "addressName": "华容区",
        "type": "AREA",
        "parentAddressId": 3174
      },
      {
        "addressId": 5574,
        "addressName": "鄂城区",
        "type": "AREA",
        "parentAddressId": 3174
      },
      {
        "addressId": 5575,
        "addressName": "东宝区",
        "type": "AREA",
        "parentAddressId": 3175
      },
      {
        "addressId": 5576,
        "addressName": "掇刀区",
        "type": "AREA",
        "parentAddressId": 3175
      },
      {
        "addressId": 5577,
        "addressName": "京山县",
        "type": "AREA",
        "parentAddressId": 3175
      },
      {
        "addressId": 5578,
        "addressName": "沙洋县",
        "type": "AREA",
        "parentAddressId": 3175
      },
      {
        "addressId": 5579,
        "addressName": "钟祥市",
        "type": "AREA",
        "parentAddressId": 3175
      },
      {
        "addressId": 5580,
        "addressName": "孝南区",
        "type": "AREA",
        "parentAddressId": 3176
      },
      {
        "addressId": 5581,
        "addressName": "孝昌县",
        "type": "AREA",
        "parentAddressId": 3176
      },
      {
        "addressId": 5582,
        "addressName": "大悟县",
        "type": "AREA",
        "parentAddressId": 3176
      },
      {
        "addressId": 5583,
        "addressName": "云梦县",
        "type": "AREA",
        "parentAddressId": 3176
      },
      {
        "addressId": 5584,
        "addressName": "应城市",
        "type": "AREA",
        "parentAddressId": 3176
      },
      {
        "addressId": 5585,
        "addressName": "安陆市",
        "type": "AREA",
        "parentAddressId": 3176
      },
      {
        "addressId": 5586,
        "addressName": "汉川市",
        "type": "AREA",
        "parentAddressId": 3176
      },
      {
        "addressId": 5587,
        "addressName": "沙市区",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5588,
        "addressName": "荆州区",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5589,
        "addressName": "公安县",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5590,
        "addressName": "监利县",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5591,
        "addressName": "江陵县",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5592,
        "addressName": "石首市",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5593,
        "addressName": "洪湖市",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5594,
        "addressName": "松滋市",
        "type": "AREA",
        "parentAddressId": 3177
      },
      {
        "addressId": 5595,
        "addressName": "黄州区",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5596,
        "addressName": "团风县",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5597,
        "addressName": "红安县",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5598,
        "addressName": "罗田县",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5599,
        "addressName": "英山县",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5600,
        "addressName": "浠水县",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5601,
        "addressName": "蕲春县",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5602,
        "addressName": "黄梅县",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5603,
        "addressName": "麻城市",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5604,
        "addressName": "武穴市",
        "type": "AREA",
        "parentAddressId": 3178
      },
      {
        "addressId": 5605,
        "addressName": "咸安区",
        "type": "AREA",
        "parentAddressId": 3179
      },
      {
        "addressId": 5606,
        "addressName": "嘉鱼县",
        "type": "AREA",
        "parentAddressId": 3179
      },
      {
        "addressId": 5607,
        "addressName": "通城县",
        "type": "AREA",
        "parentAddressId": 3179
      },
      {
        "addressId": 5608,
        "addressName": "崇阳县",
        "type": "AREA",
        "parentAddressId": 3179
      },
      {
        "addressId": 5609,
        "addressName": "通山县",
        "type": "AREA",
        "parentAddressId": 3179
      },
      {
        "addressId": 5610,
        "addressName": "赤壁市",
        "type": "AREA",
        "parentAddressId": 3179
      },
      {
        "addressId": 5611,
        "addressName": "曾都区",
        "type": "AREA",
        "parentAddressId": 3180
      },
      {
        "addressId": 5612,
        "addressName": "广水市",
        "type": "AREA",
        "parentAddressId": 3180
      },
      {
        "addressId": 5613,
        "addressName": "恩施市",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5614,
        "addressName": "利川市",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5615,
        "addressName": "建始县",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5616,
        "addressName": "巴东县",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5617,
        "addressName": "宣恩县",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5618,
        "addressName": "咸丰县",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5619,
        "addressName": "来凤县",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5620,
        "addressName": "鹤峰县",
        "type": "AREA",
        "parentAddressId": 3181
      },
      {
        "addressId": 5621,
        "addressName": "仙桃市",
        "type": "AREA",
        "parentAddressId": 3182
      },
      {
        "addressId": 5622,
        "addressName": "潜江市",
        "type": "AREA",
        "parentAddressId": 3182
      },
      {
        "addressId": 5623,
        "addressName": "天门市",
        "type": "AREA",
        "parentAddressId": 3182
      },
      {
        "addressId": 5624,
        "addressName": "神农架林区",
        "type": "AREA",
        "parentAddressId": 3182
      },
      {
        "addressId": 5625,
        "addressName": "芙蓉区",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5626,
        "addressName": "天心区",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5627,
        "addressName": "岳麓区",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5628,
        "addressName": "开福区",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5629,
        "addressName": "雨花区",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5630,
        "addressName": "长沙县",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5631,
        "addressName": "望城县",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5632,
        "addressName": "宁乡县",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5633,
        "addressName": "浏阳市",
        "type": "AREA",
        "parentAddressId": 3183
      },
      {
        "addressId": 5634,
        "addressName": "荷塘区",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5635,
        "addressName": "芦淞区",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5636,
        "addressName": "石峰区",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5637,
        "addressName": "天元区",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5638,
        "addressName": "株洲县",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5639,
        "addressName": "攸县",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5640,
        "addressName": "茶陵县",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5641,
        "addressName": "炎陵县",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5642,
        "addressName": "醴陵市",
        "type": "AREA",
        "parentAddressId": 3184
      },
      {
        "addressId": 5643,
        "addressName": "雨湖区",
        "type": "AREA",
        "parentAddressId": 3185
      },
      {
        "addressId": 5644,
        "addressName": "岳塘区",
        "type": "AREA",
        "parentAddressId": 3185
      },
      {
        "addressId": 5645,
        "addressName": "湘潭县",
        "type": "AREA",
        "parentAddressId": 3185
      },
      {
        "addressId": 5646,
        "addressName": "湘乡市",
        "type": "AREA",
        "parentAddressId": 3185
      },
      {
        "addressId": 5647,
        "addressName": "韶山市",
        "type": "AREA",
        "parentAddressId": 3185
      },
      {
        "addressId": 5648,
        "addressName": "珠晖区",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5649,
        "addressName": "雁峰区",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5650,
        "addressName": "石鼓区",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5651,
        "addressName": "蒸湘区",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5652,
        "addressName": "南岳区",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5653,
        "addressName": "衡阳县",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5654,
        "addressName": "衡南县",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5655,
        "addressName": "衡山县",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5656,
        "addressName": "衡东县",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5657,
        "addressName": "祁东县",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5658,
        "addressName": "耒阳市",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5659,
        "addressName": "常宁市",
        "type": "AREA",
        "parentAddressId": 3186
      },
      {
        "addressId": 5660,
        "addressName": "双清区",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5661,
        "addressName": "大祥区",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5662,
        "addressName": "北塔区",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5663,
        "addressName": "邵东县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5664,
        "addressName": "新邵县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5665,
        "addressName": "邵阳县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5666,
        "addressName": "隆回县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5667,
        "addressName": "洞口县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5668,
        "addressName": "绥宁县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5669,
        "addressName": "新宁县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5670,
        "addressName": "城步苗族自治县",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5671,
        "addressName": "武冈市",
        "type": "AREA",
        "parentAddressId": 3187
      },
      {
        "addressId": 5672,
        "addressName": "岳阳楼区",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5673,
        "addressName": "云溪区",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5674,
        "addressName": "君山区",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5675,
        "addressName": "岳阳县",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5676,
        "addressName": "华容县",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5677,
        "addressName": "湘阴县",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5678,
        "addressName": "平江县",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5679,
        "addressName": "汨罗市",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5680,
        "addressName": "临湘市",
        "type": "AREA",
        "parentAddressId": 3188
      },
      {
        "addressId": 5681,
        "addressName": "武陵区",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5682,
        "addressName": "鼎城区",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5683,
        "addressName": "安乡县",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5684,
        "addressName": "汉寿县",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5685,
        "addressName": "澧县",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5686,
        "addressName": "临澧县",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5687,
        "addressName": "桃源县",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5688,
        "addressName": "石门县",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5689,
        "addressName": "津市市",
        "type": "AREA",
        "parentAddressId": 3189
      },
      {
        "addressId": 5690,
        "addressName": "永定区",
        "type": "AREA",
        "parentAddressId": 3190
      },
      {
        "addressId": 5691,
        "addressName": "武陵源区",
        "type": "AREA",
        "parentAddressId": 3190
      },
      {
        "addressId": 5692,
        "addressName": "慈利县",
        "type": "AREA",
        "parentAddressId": 3190
      },
      {
        "addressId": 5693,
        "addressName": "桑植县",
        "type": "AREA",
        "parentAddressId": 3190
      },
      {
        "addressId": 5694,
        "addressName": "资阳区",
        "type": "AREA",
        "parentAddressId": 3191
      },
      {
        "addressId": 5695,
        "addressName": "赫山区",
        "type": "AREA",
        "parentAddressId": 3191
      },
      {
        "addressId": 5696,
        "addressName": "南县",
        "type": "AREA",
        "parentAddressId": 3191
      },
      {
        "addressId": 5697,
        "addressName": "桃江县",
        "type": "AREA",
        "parentAddressId": 3191
      },
      {
        "addressId": 5698,
        "addressName": "安化县",
        "type": "AREA",
        "parentAddressId": 3191
      },
      {
        "addressId": 5699,
        "addressName": "沅江市",
        "type": "AREA",
        "parentAddressId": 3191
      },
      {
        "addressId": 5700,
        "addressName": "北湖区",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5701,
        "addressName": "苏仙区",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5702,
        "addressName": "桂阳县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5703,
        "addressName": "宜章县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5704,
        "addressName": "永兴县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5705,
        "addressName": "嘉禾县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5706,
        "addressName": "临武县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5707,
        "addressName": "汝城县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5708,
        "addressName": "桂东县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5709,
        "addressName": "安仁县",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5710,
        "addressName": "资兴市",
        "type": "AREA",
        "parentAddressId": 3192
      },
      {
        "addressId": 5711,
        "addressName": "芝山区",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5712,
        "addressName": "冷水滩区",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5713,
        "addressName": "祁阳县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5714,
        "addressName": "东安县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5715,
        "addressName": "双牌县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5716,
        "addressName": "道县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5717,
        "addressName": "江永县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5718,
        "addressName": "宁远县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5719,
        "addressName": "蓝山县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5720,
        "addressName": "新田县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5721,
        "addressName": "江华瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3193
      },
      {
        "addressId": 5722,
        "addressName": "鹤城区",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5723,
        "addressName": "中方县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5724,
        "addressName": "沅陵县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5725,
        "addressName": "辰溪县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5726,
        "addressName": "溆浦县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5727,
        "addressName": "会同县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5728,
        "addressName": "麻阳苗族自治县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5729,
        "addressName": "新晃侗族自治县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5730,
        "addressName": "芷江侗族自治县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5731,
        "addressName": "靖州苗族侗族自治县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5732,
        "addressName": "通道侗族自治县",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5733,
        "addressName": "洪江市",
        "type": "AREA",
        "parentAddressId": 3194
      },
      {
        "addressId": 5734,
        "addressName": "娄星区",
        "type": "AREA",
        "parentAddressId": 3195
      },
      {
        "addressId": 5735,
        "addressName": "双峰县",
        "type": "AREA",
        "parentAddressId": 3195
      },
      {
        "addressId": 5736,
        "addressName": "新化县",
        "type": "AREA",
        "parentAddressId": 3195
      },
      {
        "addressId": 5737,
        "addressName": "冷水江市",
        "type": "AREA",
        "parentAddressId": 3195
      },
      {
        "addressId": 5738,
        "addressName": "涟源市",
        "type": "AREA",
        "parentAddressId": 3195
      },
      {
        "addressId": 5739,
        "addressName": "吉首市",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5740,
        "addressName": "泸溪县",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5741,
        "addressName": "凤凰县",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5742,
        "addressName": "花垣县",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5743,
        "addressName": "保靖县",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5744,
        "addressName": "古丈县",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5745,
        "addressName": "永顺县",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5746,
        "addressName": "龙山县",
        "type": "AREA",
        "parentAddressId": 3196
      },
      {
        "addressId": 5747,
        "addressName": "东山区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5748,
        "addressName": "荔湾区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5749,
        "addressName": "越秀区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5750,
        "addressName": "海珠区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5751,
        "addressName": "天河区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5752,
        "addressName": "芳村区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5753,
        "addressName": "白云区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5754,
        "addressName": "黄埔区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5755,
        "addressName": "番禺区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5756,
        "addressName": "花都区",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5757,
        "addressName": "增城市",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5758,
        "addressName": "从化市",
        "type": "AREA",
        "parentAddressId": 3197
      },
      {
        "addressId": 5759,
        "addressName": "武江区",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5760,
        "addressName": "浈江区",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5761,
        "addressName": "曲江区",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5762,
        "addressName": "始兴县",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5763,
        "addressName": "仁化县",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5764,
        "addressName": "翁源县",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5765,
        "addressName": "乳源瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5766,
        "addressName": "新丰县",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5767,
        "addressName": "乐昌市",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5768,
        "addressName": "南雄市",
        "type": "AREA",
        "parentAddressId": 3198
      },
      {
        "addressId": 5769,
        "addressName": "罗湖区",
        "type": "AREA",
        "parentAddressId": 3199
      },
      {
        "addressId": 5770,
        "addressName": "福田区",
        "type": "AREA",
        "parentAddressId": 3199
      },
      {
        "addressId": 5771,
        "addressName": "南山区",
        "type": "AREA",
        "parentAddressId": 3199
      },
      {
        "addressId": 5772,
        "addressName": "宝安区",
        "type": "AREA",
        "parentAddressId": 3199
      },
      {
        "addressId": 5773,
        "addressName": "龙岗区",
        "type": "AREA",
        "parentAddressId": 3199
      },
      {
        "addressId": 5774,
        "addressName": "盐田区",
        "type": "AREA",
        "parentAddressId": 3199
      },
      {
        "addressId": 5775,
        "addressName": "香洲区",
        "type": "AREA",
        "parentAddressId": 3200
      },
      {
        "addressId": 5776,
        "addressName": "斗门区",
        "type": "AREA",
        "parentAddressId": 3200
      },
      {
        "addressId": 5777,
        "addressName": "金湾区",
        "type": "AREA",
        "parentAddressId": 3200
      },
      {
        "addressId": 5778,
        "addressName": "龙湖区",
        "type": "AREA",
        "parentAddressId": 3201
      },
      {
        "addressId": 5779,
        "addressName": "金平区",
        "type": "AREA",
        "parentAddressId": 3201
      },
      {
        "addressId": 5780,
        "addressName": "濠江区",
        "type": "AREA",
        "parentAddressId": 3201
      },
      {
        "addressId": 5781,
        "addressName": "潮阳区",
        "type": "AREA",
        "parentAddressId": 3201
      },
      {
        "addressId": 5782,
        "addressName": "潮南区",
        "type": "AREA",
        "parentAddressId": 3201
      },
      {
        "addressId": 5783,
        "addressName": "澄海区",
        "type": "AREA",
        "parentAddressId": 3201
      },
      {
        "addressId": 5784,
        "addressName": "南澳县",
        "type": "AREA",
        "parentAddressId": 3201
      },
      {
        "addressId": 5785,
        "addressName": "禅城区",
        "type": "AREA",
        "parentAddressId": 3202
      },
      {
        "addressId": 5786,
        "addressName": "南海区",
        "type": "AREA",
        "parentAddressId": 3202
      },
      {
        "addressId": 5787,
        "addressName": "顺德区",
        "type": "AREA",
        "parentAddressId": 3202
      },
      {
        "addressId": 5788,
        "addressName": "三水区",
        "type": "AREA",
        "parentAddressId": 3202
      },
      {
        "addressId": 5789,
        "addressName": "高明区",
        "type": "AREA",
        "parentAddressId": 3202
      },
      {
        "addressId": 5790,
        "addressName": "蓬江区",
        "type": "AREA",
        "parentAddressId": 3203
      },
      {
        "addressId": 5791,
        "addressName": "江海区",
        "type": "AREA",
        "parentAddressId": 3203
      },
      {
        "addressId": 5792,
        "addressName": "新会区",
        "type": "AREA",
        "parentAddressId": 3203
      },
      {
        "addressId": 5793,
        "addressName": "台山市",
        "type": "AREA",
        "parentAddressId": 3203
      },
      {
        "addressId": 5794,
        "addressName": "开平市",
        "type": "AREA",
        "parentAddressId": 3203
      },
      {
        "addressId": 5795,
        "addressName": "鹤山市",
        "type": "AREA",
        "parentAddressId": 3203
      },
      {
        "addressId": 5796,
        "addressName": "恩平市",
        "type": "AREA",
        "parentAddressId": 3203
      },
      {
        "addressId": 5797,
        "addressName": "赤坎区",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5798,
        "addressName": "霞山区",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5799,
        "addressName": "坡头区",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5800,
        "addressName": "麻章区",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5801,
        "addressName": "遂溪县",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5802,
        "addressName": "徐闻县",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5803,
        "addressName": "廉江市",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5804,
        "addressName": "雷州市",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5805,
        "addressName": "吴川市",
        "type": "AREA",
        "parentAddressId": 3204
      },
      {
        "addressId": 5806,
        "addressName": "茂南区",
        "type": "AREA",
        "parentAddressId": 3205
      },
      {
        "addressId": 5807,
        "addressName": "茂港区",
        "type": "AREA",
        "parentAddressId": 3205
      },
      {
        "addressId": 5808,
        "addressName": "电白县",
        "type": "AREA",
        "parentAddressId": 3205
      },
      {
        "addressId": 5809,
        "addressName": "高州市",
        "type": "AREA",
        "parentAddressId": 3205
      },
      {
        "addressId": 5810,
        "addressName": "化州市",
        "type": "AREA",
        "parentAddressId": 3205
      },
      {
        "addressId": 5811,
        "addressName": "信宜市",
        "type": "AREA",
        "parentAddressId": 3205
      },
      {
        "addressId": 5812,
        "addressName": "端州区",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5813,
        "addressName": "鼎湖区",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5814,
        "addressName": "广宁县",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5815,
        "addressName": "怀集县",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5816,
        "addressName": "封开县",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5817,
        "addressName": "德庆县",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5818,
        "addressName": "高要市",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5819,
        "addressName": "四会市",
        "type": "AREA",
        "parentAddressId": 3206
      },
      {
        "addressId": 5820,
        "addressName": "惠城区",
        "type": "AREA",
        "parentAddressId": 3207
      },
      {
        "addressId": 5821,
        "addressName": "惠阳区",
        "type": "AREA",
        "parentAddressId": 3207
      },
      {
        "addressId": 5822,
        "addressName": "博罗县",
        "type": "AREA",
        "parentAddressId": 3207
      },
      {
        "addressId": 5823,
        "addressName": "惠东县",
        "type": "AREA",
        "parentAddressId": 3207
      },
      {
        "addressId": 5824,
        "addressName": "龙门县",
        "type": "AREA",
        "parentAddressId": 3207
      },
      {
        "addressId": 5825,
        "addressName": "梅江区",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5826,
        "addressName": "梅县",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5827,
        "addressName": "大埔县",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5828,
        "addressName": "丰顺县",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5829,
        "addressName": "五华县",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5830,
        "addressName": "平远县",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5831,
        "addressName": "蕉岭县",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5832,
        "addressName": "兴宁市",
        "type": "AREA",
        "parentAddressId": 3208
      },
      {
        "addressId": 5833,
        "addressName": "城区",
        "type": "AREA",
        "parentAddressId": 3209
      },
      {
        "addressId": 5834,
        "addressName": "海丰县",
        "type": "AREA",
        "parentAddressId": 3209
      },
      {
        "addressId": 5835,
        "addressName": "陆河县",
        "type": "AREA",
        "parentAddressId": 3209
      },
      {
        "addressId": 5836,
        "addressName": "陆丰市",
        "type": "AREA",
        "parentAddressId": 3209
      },
      {
        "addressId": 5837,
        "addressName": "源城区",
        "type": "AREA",
        "parentAddressId": 3210
      },
      {
        "addressId": 5838,
        "addressName": "紫金县",
        "type": "AREA",
        "parentAddressId": 3210
      },
      {
        "addressId": 5839,
        "addressName": "龙川县",
        "type": "AREA",
        "parentAddressId": 3210
      },
      {
        "addressId": 5840,
        "addressName": "连平县",
        "type": "AREA",
        "parentAddressId": 3210
      },
      {
        "addressId": 5841,
        "addressName": "和平县",
        "type": "AREA",
        "parentAddressId": 3210
      },
      {
        "addressId": 5842,
        "addressName": "东源县",
        "type": "AREA",
        "parentAddressId": 3210
      },
      {
        "addressId": 5843,
        "addressName": "江城区",
        "type": "AREA",
        "parentAddressId": 3211
      },
      {
        "addressId": 5844,
        "addressName": "阳西县",
        "type": "AREA",
        "parentAddressId": 3211
      },
      {
        "addressId": 5845,
        "addressName": "阳东县",
        "type": "AREA",
        "parentAddressId": 3211
      },
      {
        "addressId": 5846,
        "addressName": "阳春市",
        "type": "AREA",
        "parentAddressId": 3211
      },
      {
        "addressId": 5847,
        "addressName": "清城区",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5848,
        "addressName": "佛冈县",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5849,
        "addressName": "阳山县",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5850,
        "addressName": "连山壮族瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5851,
        "addressName": "连南瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5852,
        "addressName": "清新县",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5853,
        "addressName": "英德市",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5854,
        "addressName": "连州市",
        "type": "AREA",
        "parentAddressId": 3212
      },
      {
        "addressId": 5855,
        "addressName": "湘桥区",
        "type": "AREA",
        "parentAddressId": 3215
      },
      {
        "addressId": 5856,
        "addressName": "潮安县",
        "type": "AREA",
        "parentAddressId": 3215
      },
      {
        "addressId": 5857,
        "addressName": "饶平县",
        "type": "AREA",
        "parentAddressId": 3215
      },
      {
        "addressId": 5858,
        "addressName": "榕城区",
        "type": "AREA",
        "parentAddressId": 3216
      },
      {
        "addressId": 5859,
        "addressName": "揭东县",
        "type": "AREA",
        "parentAddressId": 3216
      },
      {
        "addressId": 5860,
        "addressName": "揭西县",
        "type": "AREA",
        "parentAddressId": 3216
      },
      {
        "addressId": 5861,
        "addressName": "惠来县",
        "type": "AREA",
        "parentAddressId": 3216
      },
      {
        "addressId": 5862,
        "addressName": "普宁市",
        "type": "AREA",
        "parentAddressId": 3216
      },
      {
        "addressId": 5863,
        "addressName": "云城区",
        "type": "AREA",
        "parentAddressId": 3217
      },
      {
        "addressId": 5864,
        "addressName": "新兴县",
        "type": "AREA",
        "parentAddressId": 3217
      },
      {
        "addressId": 5865,
        "addressName": "郁南县",
        "type": "AREA",
        "parentAddressId": 3217
      },
      {
        "addressId": 5866,
        "addressName": "云安县",
        "type": "AREA",
        "parentAddressId": 3217
      },
      {
        "addressId": 5867,
        "addressName": "罗定市",
        "type": "AREA",
        "parentAddressId": 3217
      },
      {
        "addressId": 5868,
        "addressName": "兴宁区",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5869,
        "addressName": "青秀区",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5870,
        "addressName": "江南区",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5871,
        "addressName": "西乡塘区",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5872,
        "addressName": "良庆区",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5873,
        "addressName": "邕宁区",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5874,
        "addressName": "武鸣县",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5875,
        "addressName": "隆安县",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5876,
        "addressName": "马山县",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5877,
        "addressName": "上林县",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5878,
        "addressName": "宾阳县",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5879,
        "addressName": "横县",
        "type": "AREA",
        "parentAddressId": 3218
      },
      {
        "addressId": 5880,
        "addressName": "城中区",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5881,
        "addressName": "鱼峰区",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5882,
        "addressName": "柳南区",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5883,
        "addressName": "柳北区",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5884,
        "addressName": "柳江县",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5885,
        "addressName": "柳城县",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5886,
        "addressName": "鹿寨县",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5887,
        "addressName": "融安县",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5888,
        "addressName": "融水苗族自治县",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5889,
        "addressName": "三江侗族自治县",
        "type": "AREA",
        "parentAddressId": 3219
      },
      {
        "addressId": 5890,
        "addressName": "秀峰区",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5891,
        "addressName": "叠彩区",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5892,
        "addressName": "象山区",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5893,
        "addressName": "七星区",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5894,
        "addressName": "雁山区",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5895,
        "addressName": "阳朔县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5896,
        "addressName": "临桂县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5897,
        "addressName": "灵川县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5898,
        "addressName": "全州县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5899,
        "addressName": "兴安县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5900,
        "addressName": "永福县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5901,
        "addressName": "灌阳县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5902,
        "addressName": "龙胜各族自治县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5903,
        "addressName": "资源县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5904,
        "addressName": "平乐县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5905,
        "addressName": "荔蒲县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5906,
        "addressName": "恭城瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3220
      },
      {
        "addressId": 5907,
        "addressName": "万秀区",
        "type": "AREA",
        "parentAddressId": 3221
      },
      {
        "addressId": 5908,
        "addressName": "蝶山区",
        "type": "AREA",
        "parentAddressId": 3221
      },
      {
        "addressId": 5909,
        "addressName": "长洲区",
        "type": "AREA",
        "parentAddressId": 3221
      },
      {
        "addressId": 5910,
        "addressName": "苍梧县",
        "type": "AREA",
        "parentAddressId": 3221
      },
      {
        "addressId": 5911,
        "addressName": "藤县",
        "type": "AREA",
        "parentAddressId": 3221
      },
      {
        "addressId": 5912,
        "addressName": "蒙山县",
        "type": "AREA",
        "parentAddressId": 3221
      },
      {
        "addressId": 5913,
        "addressName": "岑溪市",
        "type": "AREA",
        "parentAddressId": 3221
      },
      {
        "addressId": 5914,
        "addressName": "海城区",
        "type": "AREA",
        "parentAddressId": 3222
      },
      {
        "addressId": 5915,
        "addressName": "银海区",
        "type": "AREA",
        "parentAddressId": 3222
      },
      {
        "addressId": 5916,
        "addressName": "铁山港区",
        "type": "AREA",
        "parentAddressId": 3222
      },
      {
        "addressId": 5917,
        "addressName": "合浦县",
        "type": "AREA",
        "parentAddressId": 3222
      },
      {
        "addressId": 5918,
        "addressName": "港口区",
        "type": "AREA",
        "parentAddressId": 3223
      },
      {
        "addressId": 5919,
        "addressName": "防城区",
        "type": "AREA",
        "parentAddressId": 3223
      },
      {
        "addressId": 5920,
        "addressName": "上思县",
        "type": "AREA",
        "parentAddressId": 3223
      },
      {
        "addressId": 5921,
        "addressName": "东兴市",
        "type": "AREA",
        "parentAddressId": 3223
      },
      {
        "addressId": 5922,
        "addressName": "钦南区",
        "type": "AREA",
        "parentAddressId": 3224
      },
      {
        "addressId": 5923,
        "addressName": "钦北区",
        "type": "AREA",
        "parentAddressId": 3224
      },
      {
        "addressId": 5924,
        "addressName": "灵山县",
        "type": "AREA",
        "parentAddressId": 3224
      },
      {
        "addressId": 5925,
        "addressName": "浦北县",
        "type": "AREA",
        "parentAddressId": 3224
      },
      {
        "addressId": 5926,
        "addressName": "港北区",
        "type": "AREA",
        "parentAddressId": 3225
      },
      {
        "addressId": 5927,
        "addressName": "港南区",
        "type": "AREA",
        "parentAddressId": 3225
      },
      {
        "addressId": 5928,
        "addressName": "覃塘区",
        "type": "AREA",
        "parentAddressId": 3225
      },
      {
        "addressId": 5929,
        "addressName": "平南县",
        "type": "AREA",
        "parentAddressId": 3225
      },
      {
        "addressId": 5930,
        "addressName": "桂平市",
        "type": "AREA",
        "parentAddressId": 3225
      },
      {
        "addressId": 5931,
        "addressName": "玉州区",
        "type": "AREA",
        "parentAddressId": 3226
      },
      {
        "addressId": 5932,
        "addressName": "容县",
        "type": "AREA",
        "parentAddressId": 3226
      },
      {
        "addressId": 5933,
        "addressName": "陆川县",
        "type": "AREA",
        "parentAddressId": 3226
      },
      {
        "addressId": 5934,
        "addressName": "博白县",
        "type": "AREA",
        "parentAddressId": 3226
      },
      {
        "addressId": 5935,
        "addressName": "兴业县",
        "type": "AREA",
        "parentAddressId": 3226
      },
      {
        "addressId": 5936,
        "addressName": "北流市",
        "type": "AREA",
        "parentAddressId": 3226
      },
      {
        "addressId": 5937,
        "addressName": "右江区",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5938,
        "addressName": "田阳县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5939,
        "addressName": "田东县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5940,
        "addressName": "平果县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5941,
        "addressName": "德保县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5942,
        "addressName": "靖西县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5943,
        "addressName": "那坡县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5944,
        "addressName": "凌云县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5945,
        "addressName": "乐业县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5946,
        "addressName": "田林县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5947,
        "addressName": "西林县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5948,
        "addressName": "隆林各族自治县",
        "type": "AREA",
        "parentAddressId": 3227
      },
      {
        "addressId": 5949,
        "addressName": "八步区",
        "type": "AREA",
        "parentAddressId": 3228
      },
      {
        "addressId": 5950,
        "addressName": "昭平县",
        "type": "AREA",
        "parentAddressId": 3228
      },
      {
        "addressId": 5951,
        "addressName": "钟山县",
        "type": "AREA",
        "parentAddressId": 3228
      },
      {
        "addressId": 5952,
        "addressName": "富川瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3228
      },
      {
        "addressId": 5953,
        "addressName": "金城江区",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5954,
        "addressName": "南丹县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5955,
        "addressName": "天峨县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5956,
        "addressName": "凤山县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5957,
        "addressName": "东兰县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5958,
        "addressName": "罗城仫佬族自治县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5959,
        "addressName": "环江毛南族自治县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5960,
        "addressName": "巴马瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5961,
        "addressName": "都安瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5962,
        "addressName": "大化瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5963,
        "addressName": "宜州市",
        "type": "AREA",
        "parentAddressId": 3229
      },
      {
        "addressId": 5964,
        "addressName": "兴宾区",
        "type": "AREA",
        "parentAddressId": 3230
      },
      {
        "addressId": 5965,
        "addressName": "忻城县",
        "type": "AREA",
        "parentAddressId": 3230
      },
      {
        "addressId": 5966,
        "addressName": "象州县",
        "type": "AREA",
        "parentAddressId": 3230
      },
      {
        "addressId": 5967,
        "addressName": "武宣县",
        "type": "AREA",
        "parentAddressId": 3230
      },
      {
        "addressId": 5968,
        "addressName": "金秀瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3230
      },
      {
        "addressId": 5969,
        "addressName": "合山市",
        "type": "AREA",
        "parentAddressId": 3230
      },
      {
        "addressId": 5970,
        "addressName": "江洲区",
        "type": "AREA",
        "parentAddressId": 3231
      },
      {
        "addressId": 5971,
        "addressName": "扶绥县",
        "type": "AREA",
        "parentAddressId": 3231
      },
      {
        "addressId": 5972,
        "addressName": "宁明县",
        "type": "AREA",
        "parentAddressId": 3231
      },
      {
        "addressId": 5973,
        "addressName": "龙州县",
        "type": "AREA",
        "parentAddressId": 3231
      },
      {
        "addressId": 5974,
        "addressName": "大新县",
        "type": "AREA",
        "parentAddressId": 3231
      },
      {
        "addressId": 5975,
        "addressName": "天等县",
        "type": "AREA",
        "parentAddressId": 3231
      },
      {
        "addressId": 5976,
        "addressName": "凭祥市",
        "type": "AREA",
        "parentAddressId": 3231
      },
      {
        "addressId": 5977,
        "addressName": "秀英区",
        "type": "AREA",
        "parentAddressId": 3232
      },
      {
        "addressId": 5978,
        "addressName": "龙华区",
        "type": "AREA",
        "parentAddressId": 3232
      },
      {
        "addressId": 5979,
        "addressName": "琼山区",
        "type": "AREA",
        "parentAddressId": 3232
      },
      {
        "addressId": 5980,
        "addressName": "美兰区",
        "type": "AREA",
        "parentAddressId": 3232
      },
      {
        "addressId": 5981,
        "addressName": "五指山市",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5982,
        "addressName": "琼海市",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5983,
        "addressName": "儋州市",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5984,
        "addressName": "文昌市",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5985,
        "addressName": "万宁市",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5986,
        "addressName": "东方市",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5987,
        "addressName": "定安县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5988,
        "addressName": "屯昌县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5989,
        "addressName": "澄迈县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5990,
        "addressName": "临高县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5991,
        "addressName": "白沙黎族自治县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5992,
        "addressName": "昌江黎族自治县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5993,
        "addressName": "乐东黎族自治县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5994,
        "addressName": "陵水黎族自治县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5995,
        "addressName": "保亭黎族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5996,
        "addressName": "琼中黎族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5997,
        "addressName": "西沙群岛",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5998,
        "addressName": "南沙群岛",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 5999,
        "addressName": "中沙群岛的岛礁及其海域",
        "type": "AREA",
        "parentAddressId": 3233
      },
      {
        "addressId": 6000,
        "addressName": "万州区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6001,
        "addressName": "涪陵区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6002,
        "addressName": "渝中区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6003,
        "addressName": "大渡口区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6004,
        "addressName": "江北区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6005,
        "addressName": "沙坪坝区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6006,
        "addressName": "九龙坡区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6007,
        "addressName": "南岸区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6008,
        "addressName": "北碚区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6009,
        "addressName": "万盛区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6010,
        "addressName": "双桥区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6011,
        "addressName": "渝北区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6012,
        "addressName": "巴南区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6013,
        "addressName": "黔江区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6014,
        "addressName": "长寿区",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6015,
        "addressName": "綦江县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6016,
        "addressName": "潼南县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6017,
        "addressName": "铜梁县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6018,
        "addressName": "大足县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6019,
        "addressName": "荣昌县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6020,
        "addressName": "璧山县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6021,
        "addressName": "梁平县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6022,
        "addressName": "城口县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6023,
        "addressName": "丰都县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6024,
        "addressName": "垫江县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6025,
        "addressName": "武隆县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6026,
        "addressName": "忠县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6027,
        "addressName": "开县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6028,
        "addressName": "云阳县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6029,
        "addressName": "奉节县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6030,
        "addressName": "巫山县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6031,
        "addressName": "巫溪县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6032,
        "addressName": "石柱土家族自治县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6033,
        "addressName": "秀山土家族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6034,
        "addressName": "酉阳土家族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6035,
        "addressName": "彭水苗族土家族自治县",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6036,
        "addressName": "江津市",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6037,
        "addressName": "合川市",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6038,
        "addressName": "永川市",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6039,
        "addressName": "南川市",
        "type": "AREA",
        "parentAddressId": 3234
      },
      {
        "addressId": 6040,
        "addressName": "锦江区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6041,
        "addressName": "青羊区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6042,
        "addressName": "金牛区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6043,
        "addressName": "武侯区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6044,
        "addressName": "成华区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6045,
        "addressName": "龙泉驿区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6046,
        "addressName": "青白江区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6047,
        "addressName": "新都区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6048,
        "addressName": "温江区",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6049,
        "addressName": "金堂县",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6050,
        "addressName": "双流县",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6051,
        "addressName": "郫县",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6052,
        "addressName": "大邑县",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6053,
        "addressName": "蒲江县",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6054,
        "addressName": "新津县",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6055,
        "addressName": "都江堰市",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6056,
        "addressName": "彭州市",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6057,
        "addressName": "邛崃市",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6058,
        "addressName": "崇州市",
        "type": "AREA",
        "parentAddressId": 3235
      },
      {
        "addressId": 6059,
        "addressName": "自流井区",
        "type": "AREA",
        "parentAddressId": 3236
      },
      {
        "addressId": 6060,
        "addressName": "贡井区",
        "type": "AREA",
        "parentAddressId": 3236
      },
      {
        "addressId": 6061,
        "addressName": "大安区",
        "type": "AREA",
        "parentAddressId": 3236
      },
      {
        "addressId": 6062,
        "addressName": "沿滩区",
        "type": "AREA",
        "parentAddressId": 3236
      },
      {
        "addressId": 6063,
        "addressName": "荣县",
        "type": "AREA",
        "parentAddressId": 3236
      },
      {
        "addressId": 6064,
        "addressName": "富顺县",
        "type": "AREA",
        "parentAddressId": 3236
      },
      {
        "addressId": 6065,
        "addressName": "东区",
        "type": "AREA",
        "parentAddressId": 3237
      },
      {
        "addressId": 6066,
        "addressName": "西区",
        "type": "AREA",
        "parentAddressId": 3237
      },
      {
        "addressId": 6067,
        "addressName": "仁和区",
        "type": "AREA",
        "parentAddressId": 3237
      },
      {
        "addressId": 6068,
        "addressName": "米易县",
        "type": "AREA",
        "parentAddressId": 3237
      },
      {
        "addressId": 6069,
        "addressName": "盐边县",
        "type": "AREA",
        "parentAddressId": 3237
      },
      {
        "addressId": 6070,
        "addressName": "江阳区",
        "type": "AREA",
        "parentAddressId": 3238
      },
      {
        "addressId": 6071,
        "addressName": "纳溪区",
        "type": "AREA",
        "parentAddressId": 3238
      },
      {
        "addressId": 6072,
        "addressName": "龙马潭区",
        "type": "AREA",
        "parentAddressId": 3238
      },
      {
        "addressId": 6073,
        "addressName": "泸县",
        "type": "AREA",
        "parentAddressId": 3238
      },
      {
        "addressId": 6074,
        "addressName": "合江县",
        "type": "AREA",
        "parentAddressId": 3238
      },
      {
        "addressId": 6075,
        "addressName": "叙永县",
        "type": "AREA",
        "parentAddressId": 3238
      },
      {
        "addressId": 6076,
        "addressName": "古蔺县",
        "type": "AREA",
        "parentAddressId": 3238
      },
      {
        "addressId": 6077,
        "addressName": "旌阳区",
        "type": "AREA",
        "parentAddressId": 3239
      },
      {
        "addressId": 6078,
        "addressName": "中江县",
        "type": "AREA",
        "parentAddressId": 3239
      },
      {
        "addressId": 6079,
        "addressName": "罗江县",
        "type": "AREA",
        "parentAddressId": 3239
      },
      {
        "addressId": 6080,
        "addressName": "广汉市",
        "type": "AREA",
        "parentAddressId": 3239
      },
      {
        "addressId": 6081,
        "addressName": "什邡市",
        "type": "AREA",
        "parentAddressId": 3239
      },
      {
        "addressId": 6082,
        "addressName": "绵竹市",
        "type": "AREA",
        "parentAddressId": 3239
      },
      {
        "addressId": 6083,
        "addressName": "涪城区",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6084,
        "addressName": "游仙区",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6085,
        "addressName": "三台县",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6086,
        "addressName": "盐亭县",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6087,
        "addressName": "安县",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6088,
        "addressName": "梓潼县",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6089,
        "addressName": "北川羌族自治县",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6090,
        "addressName": "平武县",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6091,
        "addressName": "江油市",
        "type": "AREA",
        "parentAddressId": 3240
      },
      {
        "addressId": 6092,
        "addressName": "市中区",
        "type": "AREA",
        "parentAddressId": 3241
      },
      {
        "addressId": 6093,
        "addressName": "元坝区",
        "type": "AREA",
        "parentAddressId": 3241
      },
      {
        "addressId": 6094,
        "addressName": "朝天区",
        "type": "AREA",
        "parentAddressId": 3241
      },
      {
        "addressId": 6095,
        "addressName": "旺苍县",
        "type": "AREA",
        "parentAddressId": 3241
      },
      {
        "addressId": 6096,
        "addressName": "青川县",
        "type": "AREA",
        "parentAddressId": 3241
      },
      {
        "addressId": 6097,
        "addressName": "剑阁县",
        "type": "AREA",
        "parentAddressId": 3241
      },
      {
        "addressId": 6098,
        "addressName": "苍溪县",
        "type": "AREA",
        "parentAddressId": 3241
      },
      {
        "addressId": 6099,
        "addressName": "船山区",
        "type": "AREA",
        "parentAddressId": 3242
      },
      {
        "addressId": 6100,
        "addressName": "安居区",
        "type": "AREA",
        "parentAddressId": 3242
      },
      {
        "addressId": 6101,
        "addressName": "蓬溪县",
        "type": "AREA",
        "parentAddressId": 3242
      },
      {
        "addressId": 6102,
        "addressName": "射洪县",
        "type": "AREA",
        "parentAddressId": 3242
      },
      {
        "addressId": 6103,
        "addressName": "大英县",
        "type": "AREA",
        "parentAddressId": 3242
      },
      {
        "addressId": 6104,
        "addressName": "市中区",
        "type": "AREA",
        "parentAddressId": 3243
      },
      {
        "addressId": 6105,
        "addressName": "东兴区",
        "type": "AREA",
        "parentAddressId": 3243
      },
      {
        "addressId": 6106,
        "addressName": "威远县",
        "type": "AREA",
        "parentAddressId": 3243
      },
      {
        "addressId": 6107,
        "addressName": "资中县",
        "type": "AREA",
        "parentAddressId": 3243
      },
      {
        "addressId": 6108,
        "addressName": "隆昌县",
        "type": "AREA",
        "parentAddressId": 3243
      },
      {
        "addressId": 6109,
        "addressName": "市中区",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6110,
        "addressName": "沙湾区",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6111,
        "addressName": "五通桥区",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6112,
        "addressName": "金口河区",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6113,
        "addressName": "犍为县",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6114,
        "addressName": "井研县",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6115,
        "addressName": "夹江县",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6116,
        "addressName": "沐川县",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6117,
        "addressName": "峨边彝族自治县",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6118,
        "addressName": "马边彝族自治县",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6119,
        "addressName": "峨眉山市",
        "type": "AREA",
        "parentAddressId": 3244
      },
      {
        "addressId": 6120,
        "addressName": "顺庆区",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6121,
        "addressName": "高坪区",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6122,
        "addressName": "嘉陵区",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6123,
        "addressName": "南部县",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6124,
        "addressName": "营山县",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6125,
        "addressName": "蓬安县",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6126,
        "addressName": "仪陇县",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6127,
        "addressName": "西充县",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6128,
        "addressName": "阆中市",
        "type": "AREA",
        "parentAddressId": 3245
      },
      {
        "addressId": 6129,
        "addressName": "东坡区",
        "type": "AREA",
        "parentAddressId": 3246
      },
      {
        "addressId": 6130,
        "addressName": "仁寿县",
        "type": "AREA",
        "parentAddressId": 3246
      },
      {
        "addressId": 6131,
        "addressName": "彭山县",
        "type": "AREA",
        "parentAddressId": 3246
      },
      {
        "addressId": 6132,
        "addressName": "洪雅县",
        "type": "AREA",
        "parentAddressId": 3246
      },
      {
        "addressId": 6133,
        "addressName": "丹棱县",
        "type": "AREA",
        "parentAddressId": 3246
      },
      {
        "addressId": 6134,
        "addressName": "青神县",
        "type": "AREA",
        "parentAddressId": 3246
      },
      {
        "addressId": 6135,
        "addressName": "翠屏区",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6136,
        "addressName": "宜宾县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6137,
        "addressName": "南溪县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6138,
        "addressName": "江安县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6139,
        "addressName": "长宁县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6140,
        "addressName": "高县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6141,
        "addressName": "珙县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6142,
        "addressName": "筠连县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6143,
        "addressName": "兴文县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6144,
        "addressName": "屏山县",
        "type": "AREA",
        "parentAddressId": 3247
      },
      {
        "addressId": 6145,
        "addressName": "广安区",
        "type": "AREA",
        "parentAddressId": 3248
      },
      {
        "addressId": 6146,
        "addressName": "岳池县",
        "type": "AREA",
        "parentAddressId": 3248
      },
      {
        "addressId": 6147,
        "addressName": "武胜县",
        "type": "AREA",
        "parentAddressId": 3248
      },
      {
        "addressId": 6148,
        "addressName": "邻水县",
        "type": "AREA",
        "parentAddressId": 3248
      },
      {
        "addressId": 6149,
        "addressName": "华蓥市",
        "type": "AREA",
        "parentAddressId": 3248
      },
      {
        "addressId": 6150,
        "addressName": "通川区",
        "type": "AREA",
        "parentAddressId": 3249
      },
      {
        "addressId": 6151,
        "addressName": "达县",
        "type": "AREA",
        "parentAddressId": 3249
      },
      {
        "addressId": 6152,
        "addressName": "宣汉县",
        "type": "AREA",
        "parentAddressId": 3249
      },
      {
        "addressId": 6153,
        "addressName": "开江县",
        "type": "AREA",
        "parentAddressId": 3249
      },
      {
        "addressId": 6154,
        "addressName": "大竹县",
        "type": "AREA",
        "parentAddressId": 3249
      },
      {
        "addressId": 6155,
        "addressName": "渠县",
        "type": "AREA",
        "parentAddressId": 3249
      },
      {
        "addressId": 6156,
        "addressName": "万源市",
        "type": "AREA",
        "parentAddressId": 3249
      },
      {
        "addressId": 6157,
        "addressName": "雨城区",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6158,
        "addressName": "名山县",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6159,
        "addressName": "荥经县",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6160,
        "addressName": "汉源县",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6161,
        "addressName": "石棉县",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6162,
        "addressName": "天全县",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6163,
        "addressName": "芦山县",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6164,
        "addressName": "宝兴县",
        "type": "AREA",
        "parentAddressId": 3250
      },
      {
        "addressId": 6165,
        "addressName": "巴州区",
        "type": "AREA",
        "parentAddressId": 3251
      },
      {
        "addressId": 6166,
        "addressName": "通江县",
        "type": "AREA",
        "parentAddressId": 3251
      },
      {
        "addressId": 6167,
        "addressName": "南江县",
        "type": "AREA",
        "parentAddressId": 3251
      },
      {
        "addressId": 6168,
        "addressName": "平昌县",
        "type": "AREA",
        "parentAddressId": 3251
      },
      {
        "addressId": 6169,
        "addressName": "雁江区",
        "type": "AREA",
        "parentAddressId": 3252
      },
      {
        "addressId": 6170,
        "addressName": "安岳县",
        "type": "AREA",
        "parentAddressId": 3252
      },
      {
        "addressId": 6171,
        "addressName": "乐至县",
        "type": "AREA",
        "parentAddressId": 3252
      },
      {
        "addressId": 6172,
        "addressName": "简阳市",
        "type": "AREA",
        "parentAddressId": 3252
      },
      {
        "addressId": 6173,
        "addressName": "汶川县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6174,
        "addressName": "理县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6175,
        "addressName": "茂县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6176,
        "addressName": "松潘县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6177,
        "addressName": "九寨沟县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6178,
        "addressName": "金川县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6179,
        "addressName": "小金县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6180,
        "addressName": "黑水县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6181,
        "addressName": "马尔康县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6182,
        "addressName": "壤塘县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6183,
        "addressName": "阿坝县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6184,
        "addressName": "若尔盖县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6185,
        "addressName": "红原县",
        "type": "AREA",
        "parentAddressId": 3253
      },
      {
        "addressId": 6186,
        "addressName": "康定县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6187,
        "addressName": "泸定县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6188,
        "addressName": "丹巴县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6189,
        "addressName": "九龙县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6190,
        "addressName": "雅江县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6191,
        "addressName": "道孚县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6192,
        "addressName": "炉霍县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6193,
        "addressName": "甘孜县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6194,
        "addressName": "新龙县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6195,
        "addressName": "德格县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6196,
        "addressName": "白玉县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6197,
        "addressName": "石渠县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6198,
        "addressName": "色达县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6199,
        "addressName": "理塘县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6200,
        "addressName": "巴塘县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6201,
        "addressName": "乡城县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6202,
        "addressName": "稻城县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6203,
        "addressName": "得荣县",
        "type": "AREA",
        "parentAddressId": 3254
      },
      {
        "addressId": 6204,
        "addressName": "西昌市",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6205,
        "addressName": "木里藏族自治县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6206,
        "addressName": "盐源县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6207,
        "addressName": "德昌县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6208,
        "addressName": "会理县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6209,
        "addressName": "会东县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6210,
        "addressName": "宁南县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6211,
        "addressName": "普格县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6212,
        "addressName": "布拖县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6213,
        "addressName": "金阳县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6214,
        "addressName": "昭觉县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6215,
        "addressName": "喜德县",
        "type": "AREA",
        "parentAddressId": 3255
      },
      {
        "addressId": 6408,
        "addressName": "丘北县",
        "type": "AREA",
        "parentAddressId": 3275
      },
      {
        "addressId": 6409,
        "addressName": "广南县",
        "type": "AREA",
        "parentAddressId": 3275
      },
      {
        "addressId": 6410,
        "addressName": "富宁县",
        "type": "AREA",
        "parentAddressId": 3275
      },
      {
        "addressId": 6411,
        "addressName": "景洪市",
        "type": "AREA",
        "parentAddressId": 3276
      },
      {
        "addressId": 6412,
        "addressName": "勐海县",
        "type": "AREA",
        "parentAddressId": 3276
      },
      {
        "addressId": 6413,
        "addressName": "勐腊县",
        "type": "AREA",
        "parentAddressId": 3276
      },
      {
        "addressId": 6414,
        "addressName": "大理市",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6415,
        "addressName": "漾濞彝族自治县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6416,
        "addressName": "祥云县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6417,
        "addressName": "宾川县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6418,
        "addressName": "弥渡县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6419,
        "addressName": "南涧彝族自治县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6420,
        "addressName": "巍山彝族回族自治县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6421,
        "addressName": "永平县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6422,
        "addressName": "云龙县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6423,
        "addressName": "洱源县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6424,
        "addressName": "剑川县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6425,
        "addressName": "鹤庆县",
        "type": "AREA",
        "parentAddressId": 3277
      },
      {
        "addressId": 6426,
        "addressName": "瑞丽市",
        "type": "AREA",
        "parentAddressId": 3278
      },
      {
        "addressId": 6427,
        "addressName": "潞西市",
        "type": "AREA",
        "parentAddressId": 3278
      },
      {
        "addressId": 6428,
        "addressName": "梁河县",
        "type": "AREA",
        "parentAddressId": 3278
      },
      {
        "addressId": 6429,
        "addressName": "盈江县",
        "type": "AREA",
        "parentAddressId": 3278
      },
      {
        "addressId": 6430,
        "addressName": "陇川县",
        "type": "AREA",
        "parentAddressId": 3278
      },
      {
        "addressId": 6431,
        "addressName": "泸水县",
        "type": "AREA",
        "parentAddressId": 3279
      },
      {
        "addressId": 6432,
        "addressName": "福贡县",
        "type": "AREA",
        "parentAddressId": 3279
      },
      {
        "addressId": 6433,
        "addressName": "贡山独龙族怒族自治县",
        "type": "AREA",
        "parentAddressId": 3279
      },
      {
        "addressId": 6434,
        "addressName": "兰坪白族普米族自治县",
        "type": "AREA",
        "parentAddressId": 3279
      },
      {
        "addressId": 6435,
        "addressName": "香格里拉县",
        "type": "AREA",
        "parentAddressId": 3280
      },
      {
        "addressId": 6436,
        "addressName": "德钦县",
        "type": "AREA",
        "parentAddressId": 3280
      },
      {
        "addressId": 6437,
        "addressName": "维西傈僳族自治县",
        "type": "AREA",
        "parentAddressId": 3280
      },
      {
        "addressId": 6438,
        "addressName": "城关区",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6439,
        "addressName": "林周县",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6440,
        "addressName": "当雄县",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6441,
        "addressName": "尼木县",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6442,
        "addressName": "曲水县",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6443,
        "addressName": "堆龙德庆县",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6444,
        "addressName": "达孜县",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6445,
        "addressName": "墨竹工卡县",
        "type": "AREA",
        "parentAddressId": 3281
      },
      {
        "addressId": 6446,
        "addressName": "昌都县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6447,
        "addressName": "江达县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6448,
        "addressName": "贡觉县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6449,
        "addressName": "类乌齐县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6450,
        "addressName": "丁青县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6451,
        "addressName": "察雅县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6452,
        "addressName": "八宿县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6453,
        "addressName": "左贡县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6454,
        "addressName": "芒康县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6455,
        "addressName": "洛隆县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6456,
        "addressName": "边坝县",
        "type": "AREA",
        "parentAddressId": 3282
      },
      {
        "addressId": 6457,
        "addressName": "乃东县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6458,
        "addressName": "扎囊县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6459,
        "addressName": "贡嘎县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6460,
        "addressName": "桑日县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6461,
        "addressName": "琼结县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6462,
        "addressName": "曲松县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6463,
        "addressName": "措美县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6464,
        "addressName": "洛扎县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6465,
        "addressName": "加查县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6466,
        "addressName": "隆子县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6467,
        "addressName": "错那县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6468,
        "addressName": "浪卡子县",
        "type": "AREA",
        "parentAddressId": 3283
      },
      {
        "addressId": 6469,
        "addressName": "日喀则市",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6470,
        "addressName": "南木林县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6471,
        "addressName": "江孜县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6472,
        "addressName": "定日县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6473,
        "addressName": "萨迦县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6474,
        "addressName": "拉孜县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6475,
        "addressName": "昂仁县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6476,
        "addressName": "谢通门县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6477,
        "addressName": "白朗县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6478,
        "addressName": "仁布县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6479,
        "addressName": "康马县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6480,
        "addressName": "定结县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6481,
        "addressName": "仲巴县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6482,
        "addressName": "亚东县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6483,
        "addressName": "吉隆县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6484,
        "addressName": "聂拉木县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6485,
        "addressName": "萨嘎县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6486,
        "addressName": "岗巴县",
        "type": "AREA",
        "parentAddressId": 3284
      },
      {
        "addressId": 6487,
        "addressName": "那曲县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6488,
        "addressName": "嘉黎县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6489,
        "addressName": "比如县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6490,
        "addressName": "聂荣县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6491,
        "addressName": "安多县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6492,
        "addressName": "申扎县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6493,
        "addressName": "索县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6494,
        "addressName": "班戈县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6495,
        "addressName": "巴青县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6496,
        "addressName": "尼玛县",
        "type": "AREA",
        "parentAddressId": 3285
      },
      {
        "addressId": 6497,
        "addressName": "普兰县",
        "type": "AREA",
        "parentAddressId": 3286
      },
      {
        "addressId": 6498,
        "addressName": "札达县",
        "type": "AREA",
        "parentAddressId": 3286
      },
      {
        "addressId": 6499,
        "addressName": "噶尔县",
        "type": "AREA",
        "parentAddressId": 3286
      },
      {
        "addressId": 6500,
        "addressName": "日土县",
        "type": "AREA",
        "parentAddressId": 3286
      },
      {
        "addressId": 6501,
        "addressName": "革吉县",
        "type": "AREA",
        "parentAddressId": 3286
      },
      {
        "addressId": 6502,
        "addressName": "改则县",
        "type": "AREA",
        "parentAddressId": 3286
      },
      {
        "addressId": 6503,
        "addressName": "措勤县",
        "type": "AREA",
        "parentAddressId": 3286
      },
      {
        "addressId": 6504,
        "addressName": "林芝县",
        "type": "AREA",
        "parentAddressId": 3287
      },
      {
        "addressId": 6505,
        "addressName": "工布江达县",
        "type": "AREA",
        "parentAddressId": 3287
      },
      {
        "addressId": 6506,
        "addressName": "米林县",
        "type": "AREA",
        "parentAddressId": 3287
      },
      {
        "addressId": 6507,
        "addressName": "墨脱县",
        "type": "AREA",
        "parentAddressId": 3287
      },
      {
        "addressId": 6508,
        "addressName": "波密县",
        "type": "AREA",
        "parentAddressId": 3287
      },
      {
        "addressId": 6509,
        "addressName": "察隅县",
        "type": "AREA",
        "parentAddressId": 3287
      },
      {
        "addressId": 6510,
        "addressName": "朗县",
        "type": "AREA",
        "parentAddressId": 3287
      },
      {
        "addressId": 6511,
        "addressName": "新城区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6512,
        "addressName": "碑林区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6513,
        "addressName": "莲湖区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6514,
        "addressName": "灞桥区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6515,
        "addressName": "未央区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6516,
        "addressName": "雁塔区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6517,
        "addressName": "阎良区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6518,
        "addressName": "临潼区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6519,
        "addressName": "长安区",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6520,
        "addressName": "蓝田县",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6521,
        "addressName": "周至县",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6522,
        "addressName": "户县",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6523,
        "addressName": "高陵县",
        "type": "AREA",
        "parentAddressId": 3288
      },
      {
        "addressId": 6524,
        "addressName": "王益区",
        "type": "AREA",
        "parentAddressId": 3289
      },
      {
        "addressId": 6525,
        "addressName": "印台区",
        "type": "AREA",
        "parentAddressId": 3289
      },
      {
        "addressId": 6526,
        "addressName": "耀州区",
        "type": "AREA",
        "parentAddressId": 3289
      },
      {
        "addressId": 6527,
        "addressName": "宜君县",
        "type": "AREA",
        "parentAddressId": 3289
      },
      {
        "addressId": 6528,
        "addressName": "渭滨区",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6529,
        "addressName": "金台区",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6530,
        "addressName": "陈仓区",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6531,
        "addressName": "凤翔县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6532,
        "addressName": "岐山县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6533,
        "addressName": "扶风县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6534,
        "addressName": "眉县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6535,
        "addressName": "陇县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6536,
        "addressName": "千阳县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6537,
        "addressName": "麟游县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6538,
        "addressName": "凤县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6539,
        "addressName": "太白县",
        "type": "AREA",
        "parentAddressId": 3290
      },
      {
        "addressId": 6540,
        "addressName": "秦都区",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6541,
        "addressName": "杨凌区",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6542,
        "addressName": "渭城区",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6543,
        "addressName": "三原县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6544,
        "addressName": "泾阳县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6545,
        "addressName": "乾县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6546,
        "addressName": "礼泉县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6547,
        "addressName": "永寿县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6548,
        "addressName": "彬县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6549,
        "addressName": "长武县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6550,
        "addressName": "旬邑县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6551,
        "addressName": "淳化县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6552,
        "addressName": "武功县",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6553,
        "addressName": "兴平市",
        "type": "AREA",
        "parentAddressId": 3291
      },
      {
        "addressId": 6554,
        "addressName": "临渭区",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6555,
        "addressName": "华县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6556,
        "addressName": "潼关县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6557,
        "addressName": "大荔县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6558,
        "addressName": "合阳县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6559,
        "addressName": "澄城县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6560,
        "addressName": "蒲城县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6561,
        "addressName": "白水县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6562,
        "addressName": "富平县",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6563,
        "addressName": "韩城市",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6564,
        "addressName": "华阴市",
        "type": "AREA",
        "parentAddressId": 3292
      },
      {
        "addressId": 6565,
        "addressName": "宝塔区",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6566,
        "addressName": "延长县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6567,
        "addressName": "延川县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6568,
        "addressName": "子长县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6569,
        "addressName": "安塞县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6570,
        "addressName": "志丹县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6571,
        "addressName": "吴旗县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6572,
        "addressName": "甘泉县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6573,
        "addressName": "富县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6574,
        "addressName": "洛川县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6575,
        "addressName": "宜川县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6576,
        "addressName": "黄龙县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6577,
        "addressName": "黄陵县",
        "type": "AREA",
        "parentAddressId": 3293
      },
      {
        "addressId": 6578,
        "addressName": "汉台区",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6579,
        "addressName": "南郑县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6580,
        "addressName": "城固县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6581,
        "addressName": "洋县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6582,
        "addressName": "西乡县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6583,
        "addressName": "勉县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6584,
        "addressName": "宁强县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6585,
        "addressName": "略阳县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6586,
        "addressName": "镇巴县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6587,
        "addressName": "留坝县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6588,
        "addressName": "佛坪县",
        "type": "AREA",
        "parentAddressId": 3294
      },
      {
        "addressId": 6589,
        "addressName": "榆阳区",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6590,
        "addressName": "神木县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6591,
        "addressName": "府谷县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6592,
        "addressName": "横山县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6593,
        "addressName": "靖边县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6594,
        "addressName": "定边县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6595,
        "addressName": "绥德县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6596,
        "addressName": "米脂县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6597,
        "addressName": "佳县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6598,
        "addressName": "吴堡县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6599,
        "addressName": "清涧县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6600,
        "addressName": "子洲县",
        "type": "AREA",
        "parentAddressId": 3295
      },
      {
        "addressId": 6601,
        "addressName": "汉滨区",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6602,
        "addressName": "汉阴县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6603,
        "addressName": "石泉县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6604,
        "addressName": "宁陕县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6605,
        "addressName": "紫阳县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6606,
        "addressName": "岚皋县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6607,
        "addressName": "平利县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6608,
        "addressName": "镇坪县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6609,
        "addressName": "旬阳县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6610,
        "addressName": "白河县",
        "type": "AREA",
        "parentAddressId": 3296
      },
      {
        "addressId": 6611,
        "addressName": "商州区",
        "type": "AREA",
        "parentAddressId": 3297
      },
      {
        "addressId": 6612,
        "addressName": "洛南县",
        "type": "AREA",
        "parentAddressId": 3297
      },
      {
        "addressId": 6613,
        "addressName": "丹凤县",
        "type": "AREA",
        "parentAddressId": 3297
      },
      {
        "addressId": 6614,
        "addressName": "商南县",
        "type": "AREA",
        "parentAddressId": 3297
      },
      {
        "addressId": 6615,
        "addressName": "山阳县",
        "type": "AREA",
        "parentAddressId": 3297
      },
      {
        "addressId": 6616,
        "addressName": "镇安县",
        "type": "AREA",
        "parentAddressId": 3297
      },
      {
        "addressId": 6617,
        "addressName": "柞水县",
        "type": "AREA",
        "parentAddressId": 3297
      },
      {
        "addressId": 6618,
        "addressName": "城关区",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6619,
        "addressName": "七里河区",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6620,
        "addressName": "西固区",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6621,
        "addressName": "安宁区",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6622,
        "addressName": "红古区",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6623,
        "addressName": "永登县",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6624,
        "addressName": "皋兰县",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6625,
        "addressName": "榆中县",
        "type": "AREA",
        "parentAddressId": 3298
      },
      {
        "addressId": 6626,
        "addressName": "金川区",
        "type": "AREA",
        "parentAddressId": 3300
      },
      {
        "addressId": 6627,
        "addressName": "永昌县",
        "type": "AREA",
        "parentAddressId": 3300
      },
      {
        "addressId": 6628,
        "addressName": "白银区",
        "type": "AREA",
        "parentAddressId": 3301
      },
      {
        "addressId": 6629,
        "addressName": "平川区",
        "type": "AREA",
        "parentAddressId": 3301
      },
      {
        "addressId": 6630,
        "addressName": "靖远县",
        "type": "AREA",
        "parentAddressId": 3301
      },
      {
        "addressId": 6631,
        "addressName": "会宁县",
        "type": "AREA",
        "parentAddressId": 3301
      },
      {
        "addressId": 6632,
        "addressName": "景泰县",
        "type": "AREA",
        "parentAddressId": 3301
      },
      {
        "addressId": 6633,
        "addressName": "秦城区",
        "type": "AREA",
        "parentAddressId": 3302
      },
      {
        "addressId": 6634,
        "addressName": "北道区",
        "type": "AREA",
        "parentAddressId": 3302
      },
      {
        "addressId": 6635,
        "addressName": "清水县",
        "type": "AREA",
        "parentAddressId": 3302
      },
      {
        "addressId": 6636,
        "addressName": "秦安县",
        "type": "AREA",
        "parentAddressId": 3302
      },
      {
        "addressId": 6637,
        "addressName": "甘谷县",
        "type": "AREA",
        "parentAddressId": 3302
      },
      {
        "addressId": 6638,
        "addressName": "武山县",
        "type": "AREA",
        "parentAddressId": 3302
      },
      {
        "addressId": 6639,
        "addressName": "张家川回族自治县",
        "type": "AREA",
        "parentAddressId": 3302
      },
      {
        "addressId": 6640,
        "addressName": "凉州区",
        "type": "AREA",
        "parentAddressId": 3303
      },
      {
        "addressId": 6641,
        "addressName": "民勤县",
        "type": "AREA",
        "parentAddressId": 3303
      },
      {
        "addressId": 6642,
        "addressName": "古浪县",
        "type": "AREA",
        "parentAddressId": 3303
      },
      {
        "addressId": 6643,
        "addressName": "天祝藏族自治县",
        "type": "AREA",
        "parentAddressId": 3303
      },
      {
        "addressId": 6644,
        "addressName": "甘州区",
        "type": "AREA",
        "parentAddressId": 3304
      },
      {
        "addressId": 6645,
        "addressName": "肃南裕固族自治县",
        "type": "AREA",
        "parentAddressId": 3304
      },
      {
        "addressId": 6646,
        "addressName": "民乐县",
        "type": "AREA",
        "parentAddressId": 3304
      },
      {
        "addressId": 6647,
        "addressName": "临泽县",
        "type": "AREA",
        "parentAddressId": 3304
      },
      {
        "addressId": 6648,
        "addressName": "高台县",
        "type": "AREA",
        "parentAddressId": 3304
      },
      {
        "addressId": 6649,
        "addressName": "山丹县",
        "type": "AREA",
        "parentAddressId": 3304
      },
      {
        "addressId": 6650,
        "addressName": "崆峒区",
        "type": "AREA",
        "parentAddressId": 3305
      },
      {
        "addressId": 6651,
        "addressName": "泾川县",
        "type": "AREA",
        "parentAddressId": 3305
      },
      {
        "addressId": 6652,
        "addressName": "灵台县",
        "type": "AREA",
        "parentAddressId": 3305
      },
      {
        "addressId": 6653,
        "addressName": "崇信县",
        "type": "AREA",
        "parentAddressId": 3305
      },
      {
        "addressId": 6654,
        "addressName": "华亭县",
        "type": "AREA",
        "parentAddressId": 3305
      },
      {
        "addressId": 6655,
        "addressName": "庄浪县",
        "type": "AREA",
        "parentAddressId": 3305
      },
      {
        "addressId": 6656,
        "addressName": "静宁县",
        "type": "AREA",
        "parentAddressId": 3305
      },
      {
        "addressId": 6657,
        "addressName": "肃州区",
        "type": "AREA",
        "parentAddressId": 3306
      },
      {
        "addressId": 6658,
        "addressName": "金塔县",
        "type": "AREA",
        "parentAddressId": 3306
      },
      {
        "addressId": 6659,
        "addressName": "安西县",
        "type": "AREA",
        "parentAddressId": 3306
      },
      {
        "addressId": 6660,
        "addressName": "肃北蒙古族自治县",
        "type": "AREA",
        "parentAddressId": 3306
      },
      {
        "addressId": 6661,
        "addressName": "阿克塞哈萨克族自治县",
        "type": "AREA",
        "parentAddressId": 3306
      },
      {
        "addressId": 6662,
        "addressName": "玉门市",
        "type": "AREA",
        "parentAddressId": 3306
      },
      {
        "addressId": 6663,
        "addressName": "敦煌市",
        "type": "AREA",
        "parentAddressId": 3306
      },
      {
        "addressId": 6664,
        "addressName": "西峰区",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6665,
        "addressName": "庆城县",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6666,
        "addressName": "环县",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6667,
        "addressName": "华池县",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6668,
        "addressName": "合水县",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6669,
        "addressName": "正宁县",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6670,
        "addressName": "宁县",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6671,
        "addressName": "镇原县",
        "type": "AREA",
        "parentAddressId": 3307
      },
      {
        "addressId": 6672,
        "addressName": "安定区",
        "type": "AREA",
        "parentAddressId": 3308
      },
      {
        "addressId": 6673,
        "addressName": "通渭县",
        "type": "AREA",
        "parentAddressId": 3308
      },
      {
        "addressId": 6674,
        "addressName": "陇西县",
        "type": "AREA",
        "parentAddressId": 3308
      },
      {
        "addressId": 6675,
        "addressName": "渭源县",
        "type": "AREA",
        "parentAddressId": 3308
      },
      {
        "addressId": 6676,
        "addressName": "临洮县",
        "type": "AREA",
        "parentAddressId": 3308
      },
      {
        "addressId": 6677,
        "addressName": "漳县",
        "type": "AREA",
        "parentAddressId": 3308
      },
      {
        "addressId": 6678,
        "addressName": "岷县",
        "type": "AREA",
        "parentAddressId": 3308
      },
      {
        "addressId": 6679,
        "addressName": "武都区",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6680,
        "addressName": "成县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6681,
        "addressName": "文县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6682,
        "addressName": "宕昌县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6683,
        "addressName": "康县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6684,
        "addressName": "西和县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6685,
        "addressName": "礼县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6686,
        "addressName": "徽县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6687,
        "addressName": "两当县",
        "type": "AREA",
        "parentAddressId": 3309
      },
      {
        "addressId": 6688,
        "addressName": "临夏市",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6689,
        "addressName": "临夏县",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6690,
        "addressName": "康乐县",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6691,
        "addressName": "永靖县",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6692,
        "addressName": "广河县",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6693,
        "addressName": "和政县",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6694,
        "addressName": "东乡族自治县",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6695,
        "addressName": "积石山保安族东乡族撒拉族自治县",
        "type": "AREA",
        "parentAddressId": 3310
      },
      {
        "addressId": 6696,
        "addressName": "合作市",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6697,
        "addressName": "临潭县",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6698,
        "addressName": "卓尼县",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6699,
        "addressName": "舟曲县",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6700,
        "addressName": "迭部县",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6701,
        "addressName": "玛曲县",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6702,
        "addressName": "碌曲县",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6703,
        "addressName": "夏河县",
        "type": "AREA",
        "parentAddressId": 3311
      },
      {
        "addressId": 6704,
        "addressName": "城东区",
        "type": "AREA",
        "parentAddressId": 3312
      },
      {
        "addressId": 6705,
        "addressName": "城中区",
        "type": "AREA",
        "parentAddressId": 3312
      },
      {
        "addressId": 6706,
        "addressName": "城西区",
        "type": "AREA",
        "parentAddressId": 3312
      },
      {
        "addressId": 6707,
        "addressName": "城北区",
        "type": "AREA",
        "parentAddressId": 3312
      },
      {
        "addressId": 6708,
        "addressName": "大通回族土族自治县",
        "type": "AREA",
        "parentAddressId": 3312
      },
      {
        "addressId": 6709,
        "addressName": "湟中县",
        "type": "AREA",
        "parentAddressId": 3312
      },
      {
        "addressId": 6710,
        "addressName": "湟源县",
        "type": "AREA",
        "parentAddressId": 3312
      },
      {
        "addressId": 6711,
        "addressName": "平安县",
        "type": "AREA",
        "parentAddressId": 3313
      },
      {
        "addressId": 6712,
        "addressName": "民和回族土族自治县",
        "type": "AREA",
        "parentAddressId": 3313
      },
      {
        "addressId": 6713,
        "addressName": "乐都县",
        "type": "AREA",
        "parentAddressId": 3313
      },
      {
        "addressId": 6714,
        "addressName": "互助土族自治县",
        "type": "AREA",
        "parentAddressId": 3313
      },
      {
        "addressId": 6715,
        "addressName": "化隆回族自治县",
        "type": "AREA",
        "parentAddressId": 3313
      },
      {
        "addressId": 6716,
        "addressName": "循化撒拉族自治县",
        "type": "AREA",
        "parentAddressId": 3313
      },
      {
        "addressId": 6717,
        "addressName": "门源回族自治县",
        "type": "AREA",
        "parentAddressId": 3314
      },
      {
        "addressId": 6718,
        "addressName": "祁连县",
        "type": "AREA",
        "parentAddressId": 3314
      },
      {
        "addressId": 6719,
        "addressName": "海晏县",
        "type": "AREA",
        "parentAddressId": 3314
      },
      {
        "addressId": 6720,
        "addressName": "刚察县",
        "type": "AREA",
        "parentAddressId": 3314
      },
      {
        "addressId": 6721,
        "addressName": "同仁县",
        "type": "AREA",
        "parentAddressId": 3315
      },
      {
        "addressId": 6722,
        "addressName": "尖扎县",
        "type": "AREA",
        "parentAddressId": 3315
      },
      {
        "addressId": 6723,
        "addressName": "泽库县",
        "type": "AREA",
        "parentAddressId": 3315
      },
      {
        "addressId": 6724,
        "addressName": "河南蒙古族自治县",
        "type": "AREA",
        "parentAddressId": 3315
      },
      {
        "addressId": 6725,
        "addressName": "共和县",
        "type": "AREA",
        "parentAddressId": 3316
      },
      {
        "addressId": 6726,
        "addressName": "同德县",
        "type": "AREA",
        "parentAddressId": 3316
      },
      {
        "addressId": 6727,
        "addressName": "贵德县",
        "type": "AREA",
        "parentAddressId": 3316
      },
      {
        "addressId": 6728,
        "addressName": "兴海县",
        "type": "AREA",
        "parentAddressId": 3316
      },
      {
        "addressId": 6729,
        "addressName": "贵南县",
        "type": "AREA",
        "parentAddressId": 3316
      },
      {
        "addressId": 6730,
        "addressName": "玛沁县",
        "type": "AREA",
        "parentAddressId": 3317
      },
      {
        "addressId": 6731,
        "addressName": "班玛县",
        "type": "AREA",
        "parentAddressId": 3317
      },
      {
        "addressId": 6732,
        "addressName": "甘德县",
        "type": "AREA",
        "parentAddressId": 3317
      },
      {
        "addressId": 6733,
        "addressName": "达日县",
        "type": "AREA",
        "parentAddressId": 3317
      },
      {
        "addressId": 6734,
        "addressName": "久治县",
        "type": "AREA",
        "parentAddressId": 3317
      },
      {
        "addressId": 6735,
        "addressName": "玛多县",
        "type": "AREA",
        "parentAddressId": 3317
      },
      {
        "addressId": 6736,
        "addressName": "玉树县",
        "type": "AREA",
        "parentAddressId": 3318
      },
      {
        "addressId": 6737,
        "addressName": "杂多县",
        "type": "AREA",
        "parentAddressId": 3318
      },
      {
        "addressId": 6738,
        "addressName": "称多县",
        "type": "AREA",
        "parentAddressId": 3318
      },
      {
        "addressId": 6739,
        "addressName": "治多县",
        "type": "AREA",
        "parentAddressId": 3318
      },
      {
        "addressId": 6740,
        "addressName": "囊谦县",
        "type": "AREA",
        "parentAddressId": 3318
      },
      {
        "addressId": 6741,
        "addressName": "曲麻莱县",
        "type": "AREA",
        "parentAddressId": 3318
      },
      {
        "addressId": 6742,
        "addressName": "格尔木市",
        "type": "AREA",
        "parentAddressId": 3319
      },
      {
        "addressId": 6743,
        "addressName": "德令哈市",
        "type": "AREA",
        "parentAddressId": 3319
      },
      {
        "addressId": 6744,
        "addressName": "乌兰县",
        "type": "AREA",
        "parentAddressId": 3319
      },
      {
        "addressId": 6745,
        "addressName": "都兰县",
        "type": "AREA",
        "parentAddressId": 3319
      },
      {
        "addressId": 6746,
        "addressName": "天峻县",
        "type": "AREA",
        "parentAddressId": 3319
      },
      {
        "addressId": 6747,
        "addressName": "兴庆区",
        "type": "AREA",
        "parentAddressId": 3320
      },
      {
        "addressId": 6748,
        "addressName": "西夏区",
        "type": "AREA",
        "parentAddressId": 3320
      },
      {
        "addressId": 6749,
        "addressName": "金凤区",
        "type": "AREA",
        "parentAddressId": 3320
      },
      {
        "addressId": 6750,
        "addressName": "永宁县",
        "type": "AREA",
        "parentAddressId": 3320
      },
      {
        "addressId": 6751,
        "addressName": "贺兰县",
        "type": "AREA",
        "parentAddressId": 3320
      },
      {
        "addressId": 6752,
        "addressName": "灵武市",
        "type": "AREA",
        "parentAddressId": 3320
      },
      {
        "addressId": 6753,
        "addressName": "大武口区",
        "type": "AREA",
        "parentAddressId": 3321
      },
      {
        "addressId": 6754,
        "addressName": "惠农区",
        "type": "AREA",
        "parentAddressId": 3321
      },
      {
        "addressId": 6755,
        "addressName": "平罗县",
        "type": "AREA",
        "parentAddressId": 3321
      },
      {
        "addressId": 6756,
        "addressName": "利通区",
        "type": "AREA",
        "parentAddressId": 3322
      },
      {
        "addressId": 6757,
        "addressName": "盐池县",
        "type": "AREA",
        "parentAddressId": 3322
      },
      {
        "addressId": 6758,
        "addressName": "同心县",
        "type": "AREA",
        "parentAddressId": 3322
      },
      {
        "addressId": 6759,
        "addressName": "青铜峡市",
        "type": "AREA",
        "parentAddressId": 3322
      },
      {
        "addressId": 6760,
        "addressName": "原州区",
        "type": "AREA",
        "parentAddressId": 3323
      },
      {
        "addressId": 6761,
        "addressName": "西吉县",
        "type": "AREA",
        "parentAddressId": 3323
      },
      {
        "addressId": 6762,
        "addressName": "隆德县",
        "type": "AREA",
        "parentAddressId": 3323
      },
      {
        "addressId": 6763,
        "addressName": "泾源县",
        "type": "AREA",
        "parentAddressId": 3323
      },
      {
        "addressId": 6764,
        "addressName": "彭阳县",
        "type": "AREA",
        "parentAddressId": 3323
      },
      {
        "addressId": 6765,
        "addressName": "沙坡头区",
        "type": "AREA",
        "parentAddressId": 3324
      },
      {
        "addressId": 6766,
        "addressName": "中宁县",
        "type": "AREA",
        "parentAddressId": 3324
      },
      {
        "addressId": 6767,
        "addressName": "海原县",
        "type": "AREA",
        "parentAddressId": 3324
      },
      {
        "addressId": 6768,
        "addressName": "天山区",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6769,
        "addressName": "沙依巴克区",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6770,
        "addressName": "新市区",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6771,
        "addressName": "水磨沟区",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6772,
        "addressName": "头屯河区",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6773,
        "addressName": "达坂城区",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6774,
        "addressName": "东山区",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6775,
        "addressName": "乌鲁木齐县",
        "type": "AREA",
        "parentAddressId": 3325
      },
      {
        "addressId": 6776,
        "addressName": "独山子区",
        "type": "AREA",
        "parentAddressId": 3326
      },
      {
        "addressId": 6777,
        "addressName": "克拉玛依区",
        "type": "AREA",
        "parentAddressId": 3326
      },
      {
        "addressId": 6778,
        "addressName": "白碱滩区",
        "type": "AREA",
        "parentAddressId": 3326
      },
      {
        "addressId": 6779,
        "addressName": "乌尔禾区",
        "type": "AREA",
        "parentAddressId": 3326
      },
      {
        "addressId": 6780,
        "addressName": "吐鲁番市",
        "type": "AREA",
        "parentAddressId": 3327
      },
      {
        "addressId": 6781,
        "addressName": "鄯善县",
        "type": "AREA",
        "parentAddressId": 3327
      },
      {
        "addressId": 6782,
        "addressName": "托克逊县",
        "type": "AREA",
        "parentAddressId": 3327
      },
      {
        "addressId": 6783,
        "addressName": "哈密市",
        "type": "AREA",
        "parentAddressId": 3328
      },
      {
        "addressId": 6784,
        "addressName": "巴里坤哈萨克自治县",
        "type": "AREA",
        "parentAddressId": 3328
      },
      {
        "addressId": 6785,
        "addressName": "伊吾县",
        "type": "AREA",
        "parentAddressId": 3328
      },
      {
        "addressId": 6786,
        "addressName": "昌吉市",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6787,
        "addressName": "阜康市",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6788,
        "addressName": "米泉市",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6789,
        "addressName": "呼图壁县",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6790,
        "addressName": "玛纳斯县",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6791,
        "addressName": "奇台县",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6792,
        "addressName": "吉木萨尔县",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6793,
        "addressName": "木垒哈萨克自治县",
        "type": "AREA",
        "parentAddressId": 3329
      },
      {
        "addressId": 6794,
        "addressName": "博乐市",
        "type": "AREA",
        "parentAddressId": 3330
      },
      {
        "addressId": 6795,
        "addressName": "精河县",
        "type": "AREA",
        "parentAddressId": 3330
      },
      {
        "addressId": 6796,
        "addressName": "温泉县",
        "type": "AREA",
        "parentAddressId": 3330
      },
      {
        "addressId": 6797,
        "addressName": "库尔勒市",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6798,
        "addressName": "轮台县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6799,
        "addressName": "尉犁县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6800,
        "addressName": "若羌县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6801,
        "addressName": "且末县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6802,
        "addressName": "焉耆回族自治县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6803,
        "addressName": "和静县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6804,
        "addressName": "和硕县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6805,
        "addressName": "博湖县",
        "type": "AREA",
        "parentAddressId": 3331
      },
      {
        "addressId": 6806,
        "addressName": "阿克苏市",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6807,
        "addressName": "温宿县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6808,
        "addressName": "库车县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6809,
        "addressName": "沙雅县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6810,
        "addressName": "新和县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6811,
        "addressName": "拜城县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6812,
        "addressName": "乌什县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6813,
        "addressName": "阿瓦提县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6814,
        "addressName": "柯坪县",
        "type": "AREA",
        "parentAddressId": 3332
      },
      {
        "addressId": 6815,
        "addressName": "阿图什市",
        "type": "AREA",
        "parentAddressId": 3333
      },
      {
        "addressId": 6816,
        "addressName": "阿克陶县",
        "type": "AREA",
        "parentAddressId": 3333
      },
      {
        "addressId": 6817,
        "addressName": "阿合奇县",
        "type": "AREA",
        "parentAddressId": 3333
      },
      {
        "addressId": 6818,
        "addressName": "乌恰县",
        "type": "AREA",
        "parentAddressId": 3333
      },
      {
        "addressId": 6819,
        "addressName": "喀什市",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6820,
        "addressName": "疏附县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6821,
        "addressName": "疏勒县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6822,
        "addressName": "英吉沙县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6823,
        "addressName": "泽普县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6824,
        "addressName": "莎车县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6825,
        "addressName": "叶城县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6826,
        "addressName": "麦盖提县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6827,
        "addressName": "岳普湖县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6828,
        "addressName": "伽师县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6829,
        "addressName": "巴楚县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6830,
        "addressName": "塔什库尔干塔吉克自治县",
        "type": "AREA",
        "parentAddressId": 3334
      },
      {
        "addressId": 6831,
        "addressName": "和田市",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6832,
        "addressName": "和田县",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6833,
        "addressName": "墨玉县",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6834,
        "addressName": "皮山县",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6835,
        "addressName": "洛浦县",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6836,
        "addressName": "策勒县",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6837,
        "addressName": "于田县",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6838,
        "addressName": "民丰县",
        "type": "AREA",
        "parentAddressId": 3335
      },
      {
        "addressId": 6839,
        "addressName": "伊宁市",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6840,
        "addressName": "奎屯市",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6841,
        "addressName": "伊宁县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6842,
        "addressName": "察布查尔锡伯自治县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6843,
        "addressName": "霍城县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6844,
        "addressName": "巩留县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6845,
        "addressName": "新源县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6846,
        "addressName": "昭苏县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6847,
        "addressName": "特克斯县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6848,
        "addressName": "尼勒克县",
        "type": "AREA",
        "parentAddressId": 3336
      },
      {
        "addressId": 6849,
        "addressName": "塔城市",
        "type": "AREA",
        "parentAddressId": 3337
      },
      {
        "addressId": 6850,
        "addressName": "乌苏市",
        "type": "AREA",
        "parentAddressId": 3337
      },
      {
        "addressId": 6851,
        "addressName": "额敏县",
        "type": "AREA",
        "parentAddressId": 3337
      },
      {
        "addressId": 6852,
        "addressName": "沙湾县",
        "type": "AREA",
        "parentAddressId": 3337
      },
      {
        "addressId": 6853,
        "addressName": "托里县",
        "type": "AREA",
        "parentAddressId": 3337
      },
      {
        "addressId": 6854,
        "addressName": "裕民县",
        "type": "AREA",
        "parentAddressId": 3337
      },
      {
        "addressId": 6855,
        "addressName": "和布克赛尔蒙古自治县",
        "type": "AREA",
        "parentAddressId": 3337
      },
      {
        "addressId": 6856,
        "addressName": "阿勒泰市",
        "type": "AREA",
        "parentAddressId": 3338
      },
      {
        "addressId": 6857,
        "addressName": "布尔津县",
        "type": "AREA",
        "parentAddressId": 3338
      },
      {
        "addressId": 6858,
        "addressName": "富蕴县",
        "type": "AREA",
        "parentAddressId": 3338
      },
      {
        "addressId": 6859,
        "addressName": "福海县",
        "type": "AREA",
        "parentAddressId": 3338
      },
      {
        "addressId": 6860,
        "addressName": "哈巴河县",
        "type": "AREA",
        "parentAddressId": 3338
      },
      {
        "addressId": 6861,
        "addressName": "青河县",
        "type": "AREA",
        "parentAddressId": 3338
      },
      {
        "addressId": 6862,
        "addressName": "吉木乃县",
        "type": "AREA",
        "parentAddressId": 3338
      },
      {
        "addressId": 6311,
        "addressName": "官渡区",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6312,
        "addressName": "西山区",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6313,
        "addressName": "东川区",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6314,
        "addressName": "呈贡县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6315,
        "addressName": "晋宁县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6316,
        "addressName": "富民县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6317,
        "addressName": "宜良县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6318,
        "addressName": "石林彝族自治县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6319,
        "addressName": "嵩明县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6320,
        "addressName": "禄劝彝族苗族自治县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6321,
        "addressName": "寻甸回族彝族自治县",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6322,
        "addressName": "安宁市",
        "type": "AREA",
        "parentAddressId": 3265
      },
      {
        "addressId": 6323,
        "addressName": "麒麟区",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6324,
        "addressName": "马龙县",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6325,
        "addressName": "陆良县",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6326,
        "addressName": "师宗县",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6327,
        "addressName": "罗平县",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6328,
        "addressName": "富源县",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6329,
        "addressName": "会泽县",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6330,
        "addressName": "沾益县",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6331,
        "addressName": "宣威市",
        "type": "AREA",
        "parentAddressId": 3266
      },
      {
        "addressId": 6332,
        "addressName": "红塔区",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6333,
        "addressName": "江川县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6334,
        "addressName": "澄江县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6335,
        "addressName": "通海县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6336,
        "addressName": "华宁县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6337,
        "addressName": "易门县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6338,
        "addressName": "峨山彝族自治县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6339,
        "addressName": "新平彝族傣族自治县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6340,
        "addressName": "元江哈尼族彝族傣族自治县",
        "type": "AREA",
        "parentAddressId": 3267
      },
      {
        "addressId": 6341,
        "addressName": "隆阳区",
        "type": "AREA",
        "parentAddressId": 3268
      },
      {
        "addressId": 6342,
        "addressName": "施甸县",
        "type": "AREA",
        "parentAddressId": 3268
      },
      {
        "addressId": 6343,
        "addressName": "腾冲县",
        "type": "AREA",
        "parentAddressId": 3268
      },
      {
        "addressId": 6344,
        "addressName": "龙陵县",
        "type": "AREA",
        "parentAddressId": 3268
      },
      {
        "addressId": 6345,
        "addressName": "昌宁县",
        "type": "AREA",
        "parentAddressId": 3268
      },
      {
        "addressId": 6346,
        "addressName": "昭阳区",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6347,
        "addressName": "鲁甸县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6348,
        "addressName": "巧家县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6349,
        "addressName": "盐津县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6350,
        "addressName": "大关县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6351,
        "addressName": "永善县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6352,
        "addressName": "绥江县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6353,
        "addressName": "镇雄县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6354,
        "addressName": "彝良县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6355,
        "addressName": "威信县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6356,
        "addressName": "水富县",
        "type": "AREA",
        "parentAddressId": 3269
      },
      {
        "addressId": 6357,
        "addressName": "古城区",
        "type": "AREA",
        "parentAddressId": 3270
      },
      {
        "addressId": 6358,
        "addressName": "玉龙纳西族自治县",
        "type": "AREA",
        "parentAddressId": 3270
      },
      {
        "addressId": 6359,
        "addressName": "永胜县",
        "type": "AREA",
        "parentAddressId": 3270
      },
      {
        "addressId": 6360,
        "addressName": "华坪县",
        "type": "AREA",
        "parentAddressId": 3270
      },
      {
        "addressId": 6361,
        "addressName": "宁蒗彝族自治县",
        "type": "AREA",
        "parentAddressId": 3270
      },
      {
        "addressId": 6362,
        "addressName": "翠云区",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6363,
        "addressName": "普洱哈尼族彝族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6364,
        "addressName": "墨江哈尼族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6365,
        "addressName": "景东彝族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6366,
        "addressName": "景谷傣族彝族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6367,
        "addressName": "镇沅彝族哈尼族拉祜族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6368,
        "addressName": "江城哈尼族彝族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6369,
        "addressName": "孟连傣族拉祜族佤族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6370,
        "addressName": "澜沧拉祜族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6371,
        "addressName": "西盟佤族自治县",
        "type": "AREA",
        "parentAddressId": 3271
      },
      {
        "addressId": 6372,
        "addressName": "临翔区",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6373,
        "addressName": "凤庆县",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6374,
        "addressName": "云县",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6375,
        "addressName": "永德县",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6376,
        "addressName": "镇康县",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6377,
        "addressName": "双江拉祜族佤族布朗族傣族自治县",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6378,
        "addressName": "耿马傣族佤族自治县",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6379,
        "addressName": "沧源佤族自治县",
        "type": "AREA",
        "parentAddressId": 3272
      },
      {
        "addressId": 6380,
        "addressName": "楚雄市",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6381,
        "addressName": "双柏县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6382,
        "addressName": "牟定县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6383,
        "addressName": "南华县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6384,
        "addressName": "姚安县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6385,
        "addressName": "大姚县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6386,
        "addressName": "永仁县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6387,
        "addressName": "元谋县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6388,
        "addressName": "武定县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6389,
        "addressName": "禄丰县",
        "type": "AREA",
        "parentAddressId": 3273
      },
      {
        "addressId": 6390,
        "addressName": "个旧市",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6391,
        "addressName": "开远市",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6392,
        "addressName": "蒙自县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6393,
        "addressName": "屏边苗族自治县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6394,
        "addressName": "建水县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6395,
        "addressName": "石屏县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6396,
        "addressName": "弥勒县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6397,
        "addressName": "泸西县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6398,
        "addressName": "元阳县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6399,
        "addressName": "红河县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6400,
        "addressName": "金平苗族瑶族傣族自治县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6401,
        "addressName": "绿春县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6402,
        "addressName": "河口瑶族自治县",
        "type": "AREA",
        "parentAddressId": 3274
      },
      {
        "addressId": 6403,
        "addressName": "文山县",
        "type": "AREA",
        "parentAddressId": 3275
      },
      {
        "addressId": 6404,
        "addressName": "砚山县",
        "type": "AREA",
        "parentAddressId": 3275
      },
      {
        "addressId": 6405,
        "addressName": "西畴县",
        "type": "AREA",
        "parentAddressId": 3275
      },
      {
        "addressId": 6406,
        "addressName": "麻栗坡县",
        "type": "AREA",
        "parentAddressId": 3275
      },
      {
        "addressId": 6407,
        "addressName": "马关县",
        "type": "AREA",
        "parentAddressId": 3275
      }
    ]
    };
    return {
      getContactbilingual: function () {
        return contactbilingual;
      },
      getCustomer_find: function () {
      return customer_find;
    },
      getCustomer_add: function(){
        return customer_add;
      },
      getApplicaion_add: function(){
        return application_add;
      },
      getCustomer_information: function () {
        return customer_information;
      },
      getQuickCreate: function () {
        return quick_create;
      },
      getApplicationBilingual: function () {
        return applicationBilingual;
      },
      getCity:function(){
        return cityData;
      }
    }
  }]);

/*
京喜财富岛
根据github@MoPoQAQ 财富岛脚本修改而来。无需京喜token,只需京东cookie即可.
cron 5 0,8,13,19 * * * jd_cfd.js
更新时间：2021-2-15
活动入口：京喜APP-我的-京喜财富岛

已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
*/
const $ = new Env("京喜财富岛");
const JD_API_HOST = "https://m.jingxi.com/";
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
$.showLog = $.getdata("cfd_showLog") ? $.getdata("cfd_showLog") === "true" : false;
$.notifyTime = $.getdata("cfd_notifyTime");
$.result = [];$.shareCodes = [];
let cookiesArr = [], cookie = '', token;


 const randomCount = 0; //$['isNode']() ? 0x14 : 0x5;
 if ($['isNode']()) {
     Object['keys'](jdCookieNode)['forEach'](_0x263b06 => {
         cookiesArr['push'](jdCookieNode[_0x263b06]);
     });
     if (process['env']['JD_DEBUG'] && process['env']['JD_DEBUG'] === 'false') console['log'] = () => {};
     //if (JSON['stringify'](process['env'])['indexOf']('GITHUB') > -0x1) process['exit'](0x0);
 } else {
     cookiesArr = [$['getdata']('CookieJD'), $['getdata']('CookieJD2'), ...jsonParse($['getdata']('CookiesJD') || '[]')['map'](_0x2e3ef5 => _0x2e3ef5['cookie'])]['filter'](_0x261c48 => !!_0x261c48);
 }!(async () => {
     var _0x5557a9 = {
         'qFTGv': function(_0x6aae82, _0x2c6dc0) {
             return _0x6aae82(_0x2c6dc0);
         },
         'MQHQQ': function(_0x9d0439, _0x4913ab) {
             return _0x9d0439(_0x4913ab);
         },
         'UDmWB': function(_0x38d559, _0x42eab2) {
             return _0x38d559(_0x42eab2);
         },
         'vnUpT': function(_0x390175) {
             return _0x390175();
         },
         'kDunq': 'UUXpt',
         'pXMAk': '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取',
         'cxASV': 'https://bean.m.jd.com/bean/signIndex.action',
         'dnDIo': 'https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/cfd.json',
         'Fpxcy': function(_0x1a4075, _0x6202aa) {
             return _0x1a4075 <= _0x6202aa;
         },
         'LiXuS': function(_0x2fe291, _0x25e58b) {
             return _0x2fe291(_0x25e58b);
         },
         'uOgiE': 'https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/cfd.json',
         'JOdZO': function(_0x5a1a09, _0x214ec3) {
             return _0x5a1a09(_0x214ec3);
         },
         'iNaBx': function(_0x3dced7, _0x5e15d9) {
             return _0x3dced7 !== _0x5e15d9;
         },
         'DKvvn': 'mmbil',
         'bnsnF': function(_0x482731) {
             return _0x482731();
         },
         'xswXW': function(_0x149b63, _0x28f518) {
             return _0x149b63 < _0x28f518;
         },
         'ottNj': function(_0x4f9931, _0x509f13) {
             return _0x4f9931(_0x509f13);
         },
         'wFmXb': function(_0x469219) {
             return _0x469219();
         }
     };
     await _0x5557a9['vnUpT'](requireConfig);
     if (!cookiesArr[0x0]) {
         if (_0x5557a9['kDunq'] !== 'UUXpt') {
             let _0x53475f = _0x5557a9['qFTGv'](uuid, 0x28);
             let _0x3ae259 = (+new Date())['toString']();
             if (!cookie['match'](/pt_pin=([^; ]+)(?=;?)/)) {
                 console['log']('此账号cookie填写不规范,你的pt_pin=xxx后面没分号(;)\x0a');
                 _0x5557a9['MQHQQ'](resolve, null);
             }
             let _0x44f1e9 = cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1];
             let _0x3c7c4e = $['md5']('' + _0x5557a9['UDmWB'](decodeURIComponent, _0x44f1e9) + _0x3ae259 + _0x53475f + 'tPOamqCuk9NLgVPAljUyIHcPRmKlVxDy')['toString']();
             resolve({
                 'timestamp': _0x3ae259,
                 'phoneid': _0x53475f,
                 'farm_jstoken': _0x3c7c4e
             });
         } else {
             $['msg']($['name'], _0x5557a9['pXMAk'], _0x5557a9['cxASV'], {
                 'open-url': _0x5557a9['cxASV']
             });
             return;
         }
     }
     let _0x3b6899 = {},
         _0x14c33c = await _0x5557a9['UDmWB'](getAuthorShareCode, _0x5557a9['dnDIo']);
     if (_0x5557a9['Fpxcy'](new Date()['getHours'](), 0x3)) await _0x5557a9['UDmWB'](getAuthorShareCode, 'https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/cfd.json');
     if (!_0x14c33c) _0x14c33c = await _0x5557a9['LiXuS'](getAuthorShareCode, _0x5557a9['uOgiE']);
     $['strMyShareIds'] = [..._0x3b6899 && _0x3b6899['shareId'] || [], ..._0x14c33c && _0x14c33c['shareId'] || []];
     $['strGroupIds'] = [..._0x3b6899 && _0x3b6899['strGroupIds'] || [], ..._0x14c33c && _0x14c33c['strGroupIds'] || []];
     for (let _0x57fa7b = 0x0; _0x57fa7b < cookiesArr['length']; _0x57fa7b++) {
         if (cookiesArr[_0x57fa7b]) {
             cookie = cookiesArr[_0x57fa7b];
             $['UserName'] = _0x5557a9['JOdZO'](decodeURIComponent, cookie['match'](/pt_pin=([^; ]+)(?=;?)/) && cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);
             $['index'] = _0x57fa7b + 0x1;
             $['nickName'] = '';
             $['isLogin'] = !![];
             $['nickName'] = '';
             await TotalBean();
             console['log']('\n开始【京东账号' + $['index'] + '】' + ($['nickName'] || $['UserName']) + '\x0a');
             if (!$['isLogin']) {
                 if (_0x5557a9['iNaBx'](_0x5557a9['DKvvn'], 'mmbil')) {
                     const {
                         ret,
                         data: {
                             userTaskStatusList = []
                         } = {},
                         msg
                     } = JSON['parse'](data);
                     $['allTask'] = userTaskStatusList['filter'](_0xe69db3 => _0xe69db3['awardStatus'] !== 0x1);
                     $['log']('\n获取【📆日常任务】列表 ' + msg + '，总共' + $['allTask']['length'] + '个任务！\n' + ($['showLog'] ? data : ''));
                 } else {
                     $['msg']($['name'], '【提示】cookie已失效', '京东账号' + $['index'] + ' ' + ($['nickName'] || $['UserName']) + '\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action', {
                         'open-url': _0x5557a9['cxASV']
                     });
                     if ($['isNode']()) {
                         await notify['sendNotify']($['name'] + 'cookie已失效 - ' + $['UserName'], '京东账号' + $['index'] + ' ' + $['UserName'] + '\x0a请重新登录获取cookie');
                     }
                     continue;
                 }
             }
             token = await _0x5557a9['vnUpT'](getJxToken);
             $['allTask'] = [];
             $['info'] = {};
             await _0x5557a9['vnUpT'](shareCodesFormat);
             await _0x5557a9['bnsnF'](cfd);
         }
     }
     for (let _0x173849 = 0x0; _0x5557a9['xswXW'](_0x173849, cookiesArr['length']); _0x173849++) {
         cookie = cookiesArr[_0x173849];
         $['UserName'] = _0x5557a9['JOdZO'](decodeURIComponent, cookie['match'](/pt_pin=([^; ]+)(?=;?)/) && cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);
         token = await _0x5557a9['bnsnF'](getJxToken);
         $['canHelp'] = !![];
         if ($['shareCodes'] && $['shareCodes']['length']) console['log']('\x0a\x0a寻宝大作战，自己账号内部循环互助\x0a\x0a');
         for (let _0x3b1965 of $['shareCodes']) {
             console['log']('账号' + $['UserName'] + ' 去参加 ' + _0x3b1965 + ' 寻宝大作战');
             await _0x5557a9['ottNj'](joinGroup, _0x3b1965);
             await $['wait'](0x1f40);
             await $['wait'](0x2710);
             if (!$['canHelp']) break;
         }
     }
     await $['wait'](0x1f4);
     await _0x5557a9['wFmXb'](showMsg);
 })()['catch'](_0x100df1 => $['logErr'](_0x100df1))['finally'](() => $['done']());

 function helpFriend() {
     var _0x305178 = {
         'zsxiZ': function(_0x2f7d2b, _0x3acccd) {
             return _0x2f7d2b === _0x3acccd;
         },
         'XJieG': function(_0x3ea70c, _0x25e35e) {
             return _0x3ea70c === _0x25e35e;
         },
         'NVXml': 'lbfda',
         'KOjuG': function(_0x34e5fc, _0x38f149) {
             return _0x34e5fc(_0x38f149);
         },
         'mUBsZ': function(_0xdac1e4, _0x1897d0) {
             return _0xdac1e4(_0x1897d0);
         },
         'DULXw': function(_0x381b10, _0x1698a1) {
             return _0x381b10(_0x1698a1);
         }
     };
     return new Promise(async _0x56cd7b => {
         if (_0x305178['XJieG'](_0x305178['NVXml'], _0x305178['NVXml'])) {
             $['canHelp'] = !![];
             for (let _0x527224 of $['newShareCodes']['filter'](_0x1df5a1 => !!_0x1df5a1 && !_0x1df5a1['includes']('GroupId'))) {
                 console['log']('去助力好友 【' + _0x527224 + '】');
                 if (token) await _0x305178['KOjuG'](createSuperAssistUser, _0x527224);
                 await $['wait'](0x2710);
                 await $['wait'](0x2710);
                 await _0x305178['mUBsZ'](createAssistUser, _0x527224);
                 if (!$['canHelp']) break;
                 await $['wait'](0x2710);
                 await $['wait'](0x2ee0);
             }
             if (token) {
                 $['canHelp'] = !![];
                 for (let _0x4dcea1 of $['strGroupIds']) {
                     console['log']('去参加寻宝大作战 ' + _0x4dcea1 + ' 等待10秒');
                     await _0x305178['DULXw'](joinGroup, _0x4dcea1);
                     if (!$['canHelp']) break;
                     await $['wait'](0x2710);
                     await $['wait'](0x2710);
                 }
             }
             _0x56cd7b();
         } else {
             console['log']('普通助力(招工)结果:' + data);
             const {
                 iRet
             } = JSON['parse'](data);
             if (_0x305178['zsxiZ'](iRet, 0x7d5) || _0x305178['zsxiZ'](iRet, 0x270f)) $['canHelp'] = ![];
         }
     });
 }
 async function cfd() {
     var _0x36ce54 = {
         'TUmPN': 'gzXHA',
         'TphYb': function(_0x2a824d) {
             return _0x2a824d();
         },
         'dyrFs': function(_0x20a168, _0x260733) {
             return _0x20a168(_0x260733);
         },
         'YsBIW': function(_0x417832, _0x473c03) {
             return _0x417832(_0x473c03);
         },
         'QPuhC': function(_0x108e30) {
             return _0x108e30();
         },
         'djCUT': function(_0xbaf3af) {
             return _0xbaf3af();
         },
         'dsQNV': function(_0x5c0372, _0x1681a2) {
             return _0x5c0372 - _0x1681a2;
         },
         'IjkbQ': function(_0x79d14a) {
             return _0x79d14a();
         }
     };
     try {
         if (_0x36ce54['TUmPN'] === 'MxKyL') {
             if (err) {
                 console['log']('' + JSON['stringify'](err));
                 console['log']($['name'] + ' GetUserTaskStatusList API请求失败，请检查网路重试');
             } else {
                 const {
                     ret,
                     data: {
                         userTaskStatusList = []
                     } = {},
                     msg
                 } = JSON['parse'](data);
                 $['allTask'] = userTaskStatusList['filter'](_0x46f8a2 => _0x46f8a2['awardStatus'] !== 0x1);
                 $['log']('\n获取【📆日常任务】列表 ' + msg + '，总共' + $['allTask']['length'] + '个任务！\x0a' + ($['showLog'] ? data : ''));
             }
         } else {
             const _0x2145b0 = await _0x36ce54['TphYb'](getUserInfo);
             await $['wait'](0x1f4);
             await querySignList();
             await $['wait'](0x1f4);
             await getMoney();
             await $['wait'](0x1f4);
             await getTaskList(0x0);
             await $['wait'](0x1f4);
             await _0x36ce54['dyrFs'](browserTask, 0x0);
             await $['wait'](0x1f4);
             await _0x36ce54['TphYb'](treasureHunt);
             await $['wait'](0x1f4);
             await friendCircle();
             await $['wait'](0x1f4);
             await _0x36ce54['YsBIW'](getTaskList, 0x1);
             await $['wait'](0x1f4);
             await _0x36ce54['YsBIW'](browserTask, 0x1);
             await $['wait'](0x1f4);
             await _0x36ce54['QPuhC'](funCenterState);
             await $['wait'](0x1f4);
             await _0x36ce54['QPuhC'](openPeriodBox);
             await $['wait'](0x1f4);
             await _0x36ce54['djCUT'](submitGroupId);
             await $['wait'](0x1f4);
             const _0x51d8cd = await _0x36ce54['YsBIW'](getUserInfo, ![]);
             await _0x36ce54['djCUT'](helpFriend);
             $['result']['push']('【京东账号' + $['index'] + '】' + ($['nickName'] || $['UserName']), '【💵财富值】任务前: ' + _0x2145b0['ddwMoney'] + '\n【💵财富值】任务后: ' + _0x51d8cd['ddwMoney'], '【💵财富值】净增值: ' + _0x36ce54['dsQNV'](_0x51d8cd['ddwMoney'], _0x2145b0['ddwMoney']) + '\x0a');
             await _0x36ce54['IjkbQ'](helpAuthor3);
         }
     } catch (_0x4e3541) {
         $['logErr'](_0x4e3541);
     }
 }

 function getAuthorShareCode(_0x304709) {
     var _0x3b10e0 = {
         'olPmP': function(_0x59b143, _0x5b8a9f) {
             return _0x59b143 === _0x5b8a9f;
         },
         'ttziJ': 'iwrcY',
         'TYKPx': function(_0x5d1617, _0x15c7e7) {
             return _0x5d1617 !== _0x15c7e7;
         },
         'EqCTU': function(_0x17d701) {
             return _0x17d701();
         },
         'PTQCA': function(_0xe3048a, _0x4b0f7d) {
             return _0xe3048a || _0x4b0f7d;
         },
         'EPhrL': 'xfnKi',
         'cCOzk': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88',
         'aJaIK': function(_0x3a5f04, _0x58c42a) {
             return _0x3a5f04(_0x58c42a);
         },
         'MSFYy': 'tunnel',
         'UXgXq': function(_0x3a0be3, _0x3abd39) {
             return _0x3a0be3 * _0x3abd39;
         }
     };
     return new Promise(async _0x5105a2 => {
         var _0x878d4e = {
             'UKJSt': function(_0xefc052, _0x4c20ab) {
                 return _0xefc052 == _0x4c20ab;
             },
             'cHMCu': 'success',
             'AopBi': function(_0x547ce6, _0x5254b9) {
                 return _0x3b10e0['PTQCA'](_0x547ce6, _0x5254b9);
             }
         };
         if (_0x3b10e0['olPmP'](_0x3b10e0['EPhrL'], _0x3b10e0['EPhrL'])) {
             const _0x1c012c = {
                 'url': _0x304709 + '?' + new Date(),
                 'timeout': 0x2710,
                 'headers': {
                     'User-Agent': _0x3b10e0['cCOzk']
                 }
             };
             if ($['isNode']() && process['env']['TG_PROXY_HOST'] && process['env']['TG_PROXY_PORT']) {
                 const _0x230aa4 = _0x3b10e0['aJaIK'](require, _0x3b10e0['MSFYy']);
                 const _0x8c7f25 = {
                     'https': _0x230aa4['httpsOverHttp']({
                         'proxy': {
                             'host': process['env']['TG_PROXY_HOST'],
                             'port': _0x3b10e0['UXgXq'](process['env']['TG_PROXY_PORT'], 0x1)
                         }
                     })
                 };
                 Object['assign'](_0x1c012c, {
                     'agent': _0x8c7f25
                 });
             }
             $['get'](_0x1c012c, async (_0x455385, _0x404fbb, _0x2c5c83) => {
                 if (_0x3b10e0['olPmP'](_0x3b10e0['ttziJ'], _0x3b10e0['ttziJ'])) {
                     try {
                         if (_0x3b10e0['TYKPx']('INbKs', 'INbKs')) {
                             $['logErr'](e, _0x404fbb);
                         } else {
                             _0x5105a2(JSON['parse'](_0x2c5c83));
                         }
                     } catch (_0x38a777) {} finally {
                         _0x3b10e0['EqCTU'](_0x5105a2);
                     }
                 } else {
                     if (_0x455385) {
                         console['log']('' + JSON['stringify'](_0x455385));
                         console['log']($['name'] + ' API请求失败，请检查网路重试');
                     } else {
                         if (_0x2c5c83) {
                             console['log']('随机取' + randomCount + '个码放到您固定的互助码后面(不影响已有固定互助)');
                             _0x2c5c83 = JSON['parse'](_0x2c5c83);
                         }
                     }
                 }
             });
             await $['wait'](0x2710);
             _0x3b10e0['EqCTU'](_0x5105a2);
         } else {
             if (err) {
                 console['log']('' + JSON['stringify'](err));
                 console['log']($['name'] + ' getMoney_dwSource_3 API请求失败，请检查网路重试');
             } else {
                 const {
                     iRet,
                     dwMoney,
                     sErrMsg,
                     strPin
                 } = JSON['parse'](data);
                 $['log']('\x0a【' + sceneList[_key]['strSceneName'] + '】👬好友: ' + (_0x878d4e['UKJSt'](sErrMsg, _0x878d4e['cHMCu']) ? '获取超级助力财富值：¥ ' + _0x878d4e['AopBi'](dwMoney, 0x0) : sErrMsg) + ' \x0a' + ($['showLog'] ? data : ''));
             }
         }
     });
 }

 function getRandomArrayElements(_0x22b256, _0x5f10ef) {
     var _0x230473 = {
         'PUAzK': function(_0x267598, _0x49b4a8) {
             return _0x267598 - _0x49b4a8;
         },
         'BYiIt': function(_0x1f77eb, _0x1ceaa5) {
             return _0x1f77eb > _0x1ceaa5;
         },
         'SzRVs': function(_0x3b3978, _0x1deab6) {
             return _0x3b3978 === _0x1deab6;
         },
         'qpACg': 'zyLLU',
         'VkXkx': function(_0x1408b0, _0xd08960) {
             return _0x1408b0 * _0xd08960;
         },
         'SlFVb': function(_0x5de0e4, _0x1227c9) {
             return _0x5de0e4 + _0x1227c9;
         }
     };
     let _0x521e0e = _0x22b256['slice'](0x0),
         _0x1bb0b5 = _0x22b256['length'],
         _0x5ac183 = _0x230473['PUAzK'](_0x1bb0b5, _0x5f10ef),
         _0x193805, _0x42c243;
     while (_0x230473['BYiIt'](_0x1bb0b5--, _0x5ac183)) {
         if (_0x230473['SzRVs'](_0x230473['qpACg'], _0x230473['qpACg'])) {
             _0x42c243 = Math['floor'](_0x230473['VkXkx'](_0x230473['SlFVb'](_0x1bb0b5, 0x1), Math['random']()));
             _0x193805 = _0x521e0e[_0x42c243];
             _0x521e0e[_0x42c243] = _0x521e0e[_0x1bb0b5];
             _0x521e0e[_0x1bb0b5] = _0x193805;
         } else {
             resolve();
         }
     }
     return _0x521e0e['slice'](_0x5ac183);
 }
 async function helpAuthor3() {
     var _0x1cc2e4 = {
         'KFyPc': function(_0x2d935a) {
             return _0x2d935a();
         },
         'rmHhC': 'https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/cfd.json',
         'HEaIw': function(_0x6746f0, _0x13959e, _0x4c3961) {
             return _0x6746f0(_0x13959e, _0x4c3961);
         },
         'salfQ': function(_0x37c1ab, _0x50a5fa) {
             return _0x37c1ab > _0x50a5fa;
         },
         'wiNin': 'KhXTA',
         'OtKKv': 'https://h5.m.jd.com',
         'itfSv': 'zh-cn',
         'hYoXt': 'https://h5.m.jd.com/babelDiy/Zeus/25C6dc6HY6if6DT7e58A1pi2Vxe4/index.html?activityId=73cf1fe89d33433d9cc8688d1892d432&assistId=R2u2OCB9eEbcCVB_CiVKhg'
     };
     let _0x4760cc = await _0x1cc2e4['KFyPc'](getAuthorShareCode2),
         _0x5e63f2 = await getAuthorShareCode2(_0x1cc2e4['rmHhC']);
     $['MyShareIds'] = [..._0x4760cc || [], ..._0x5e63f2 || []];
     $['MyShareIds'] = _0x1cc2e4['HEaIw'](getRandomArrayElements, $['MyShareIds'], _0x1cc2e4['salfQ']($['MyShareIds']['length'], 0x3) ? 0x6 : $['MyShareIds']['length']);
     for (let _0x409d51 of $['MyShareIds'] || []) {
         if (_0x1cc2e4['wiNin'] === 'SBkqX') {
             console['log']('' + JSON['stringify'](err));
             console['log']($['name'] + ' activeScene API请求失败，请检查网路重试');
         } else {
             const _0x1d0345 = {
                 'url': 'https://api.m.jd.com/client.action?clientVersion=9.3.5&client=wh5&functionId=smtfission_assist&appid=smtFission&body=' + escape(JSON['stringify'](_0x409d51)),
                 'headers': {
                     'Host': 'api.m.jd.com',
                     'accept': 'application/json, text/plain, */*',
                     'origin': _0x1cc2e4['OtKKv'],
                     'user-agent': 'jdapp;iPhone;9.3.5;14.2;53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,2;addressid/137923973;supportBestPay/0;appBuild/167515;jdSupportDarkMode/0;pv/2217.74;apprpd/MyJD_PersonalSpace;ref/MySpace;psq/8;ads/;psn/53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2|8703;jdv/0|kong|t_1000170135|tuiguang|notset|1610674234917|1610674234;adk/;app_device/IOS;pap/JA2015_311210|9.3.5|IOS 14.2;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
                     'accept-language': _0x1cc2e4['itfSv'],
                     'referer': _0x1cc2e4['hYoXt'],
                     'Cookie': cookie
                 },
                 'timeout': 0x2710
             };
             $['get'](_0x1d0345);
         }
     }
 }

 function getAuthorShareCode2(_0x4f0d87 = 'https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/cfd.json') {
     var _0x23c948 = {
         'Hmxig': function(_0x495465, _0xecdc72) {
             return _0x495465(_0xecdc72);
         },
         'niJWa': 'aVkUf',
         'VjdyR': function(_0x1742fd, _0x460503) {
             return _0x1742fd === _0x460503;
         },
         'xiXDZ': 'cqTKA',
         'nETDn': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88'
     };
     return new Promise(_0x20a3f6 => {
         var _0x2a9498 = {
             'hwRLP': function(_0xa9f054, _0x498968) {
                 return _0xa9f054 || _0x498968;
             },
             'PcnFl': function(_0x23508a, _0x525856) {
                 return _0x23c948['Hmxig'](_0x23508a, _0x525856);
             },
             'bpInn': _0x23c948['niJWa'],
             'OMhBk': function(_0x24e72e, _0x21d537) {
                 return _0x24e72e(_0x21d537);
             }
         };
         if (_0x23c948['VjdyR']('cqTKA', _0x23c948['xiXDZ'])) {
             $['get']({
                 'url': _0x4f0d87,
                 'headers': {
                     'User-Agent': _0x23c948['nETDn']
                 },
                 'timeout': 0x2710
             }, async (_0x3d6ac0, _0x53f7ea, _0x3c5332) => {
                 var _0x4d9b0e = {
                     'bdLfm': function(_0x1cfada, _0x4dc3f3) {
                         return _0x2a9498['hwRLP'](_0x1cfada, _0x4dc3f3);
                     },
                     'eaJty': function(_0x4b2b20, _0x5855cb) {
                         return _0x2a9498['PcnFl'](_0x4b2b20, _0x5855cb);
                     }
                 };
                 try {
                     if (_0x2a9498['bpInn'] !== 'vHros') {
                         if (_0x3d6ac0) {} else {
                             if (_0x3c5332) _0x3c5332 = JSON['parse'](_0x3c5332);
                         }
                     } else {
                         if (_0x3d6ac0) {
                             console['log']('' + JSON['stringify'](_0x3d6ac0));
                             console['log']($['name'] + ' TreasureHunt API请求失败，请检查网路重试');
                         } else {
                             const {
                                 iRet,
                                 dwExpericnce,
                                 sErrMsg
                             } = JSON['parse'](_0x3c5332);
                             $['log']('\x0a【' + place + '】🎁寻宝：' + sErrMsg + ' ，获取随机奖励：¥ ' + _0x4d9b0e['bdLfm'](dwExpericnce, 0x0) + ' \x0a' + ($['showLog'] ? _0x3c5332 : ''));
                             _0x4d9b0e['eaJty'](_0x20a3f6, iRet);
                         }
                     }
                 } catch (_0x513f9e) {} finally {
                     _0x2a9498['OMhBk'](_0x20a3f6, _0x3c5332 || []);
                 }
             });
         } else {
             $['logErr'](e);
         }
     });
 }

 function getJxToken() {
     var _0x1e2686 = {
         'kElFH': 'abcdefghijklmnopqrstuvwxyz1234567890',
         'MNRFu': function(_0x433b6d, _0x308057) {
             return _0x433b6d < _0x308057;
         },
         'gkPpb': function(_0x531855, _0xce2a99) {
             return _0x531855(_0xce2a99);
         },
         'KPODZ': function(_0x3394ff, _0x3181f7) {
             return _0x3394ff * _0x3181f7;
         },
         'TjSvK': function(_0x2bc1b7, _0x130f17) {
             return _0x2bc1b7(_0x130f17);
         }
     };

     function _0xe18f69(_0x5487a9) {
         let _0x3f25a6 = _0x1e2686['kElFH'];
         let _0x2b8bca = '';
         for (let _0x497a6a = 0x0; _0x1e2686['MNRFu'](_0x497a6a, _0x5487a9); _0x497a6a++) {
             _0x2b8bca += _0x3f25a6[_0x1e2686['gkPpb'](parseInt, _0x1e2686['KPODZ'](Math['random'](), _0x3f25a6['length']))];
         }
         return _0x2b8bca;
     }
     return new Promise(_0x1b19fc => {
         let _0x901291 = _0x1e2686['TjSvK'](_0xe18f69, 0x28);
         let _0x5b2fde = (+new Date())['toString']();
         if (!cookie['match'](/pt_pin=([^; ]+)(?=;?)/)) {
             console['log']('此账号cookie填写不规范,你的pt_pin=xxx后面没分号(;)\n');
             _0x1e2686['TjSvK'](_0x1b19fc, null);
         }
         let _0x1bb53f = cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1];
         let _0x367e43 = $['md5']('' + decodeURIComponent(_0x1bb53f) + _0x5b2fde + _0x901291 + 'tPOamqCuk9NLgVPAljUyIHcPRmKlVxDy')['toString']();
         _0x1e2686['TjSvK'](_0x1b19fc, {
             'timestamp': _0x5b2fde,
             'phoneid': _0x901291,
             'farm_jstoken': _0x367e43
         });
     });
 }

 function getUserInfo(_0x53b8b4 = !![]) {
     var _0x573524 = {
         'DeYhd': 'ddwMoney',
         'fCYwv': 'KySUo',
         'XMjuf': function(_0x33b6f5, _0x4717ce) {
             return _0x33b6f5(_0x4717ce);
         },
         'SADKi': 'auPWA'
     };
     return new Promise(async _0x44e9ab => {
         var _0x143878 = {
             'pIXff': _0x573524['DeYhd'],
             'HcJHc': function(_0x41b8a8, _0x156feb) {
                 return _0x41b8a8 === _0x156feb;
             },
             'oDaQN': _0x573524['fCYwv'],
             'fINiM': 'DwaIQ',
             'xIdOC': 'zCLgS',
             'kRuAF': function(_0x55a887, _0x437741) {
                 return _0x573524['XMjuf'](_0x55a887, _0x437741);
             },
             'gkmde': _0x573524['SADKi']
         };
         $['get'](taskUrl('user/QueryUserInfo'), (_0x2b62cb, _0x576bb6, _0x338bef) => {
             try {
                 if (_0x2b62cb) {
                     if (_0x143878['HcJHc'](_0x143878['oDaQN'], 'bMyxV')) {
                         console['log']('由于您第' + $['index'] + '个京东账号未提供shareCode,将采纳本脚本自带的助力码\n');
                         $['newShareCodes'] = $['strMyShareIds'];
                     } else {
                         console['log']('' + JSON['stringify'](_0x2b62cb));
                         console['log']($['name'] + ' QueryUserInfo API请求失败，请检查网路重试');
                     }
                 } else {
                     if (_0x143878['fINiM'] !== _0x143878['xIdOC']) {
                         _0x338bef = JSON['parse'](_0x338bef);
                         const {
                             iret,
                             SceneList = {},
                             XbStatus: {
                                 XBDetail = [],
                                 dwXBRemainCnt
                             } = {},
                             ddwMoney,
                             dwIsNewUser,
                             sErrMsg,
                             strMyShareId,
                             strPin,
                             dwLevel
                         } = _0x338bef;
                         $['log']('\x0a获取用户信息：' + sErrMsg + '\x0a' + ($['showLog'] ? _0x338bef : ''));
                         $['log']('\n当前等级:' + dwLevel + ',财富值:' + _0x338bef[_0x143878['pIXff']] + '\x0a');
                         if (_0x53b8b4) {
                             console['log']('财富岛好友互助码每次运行都变化,旧的可继续使用');
                             $['log']('\n【京东账号' + $['index'] + '（' + $['UserName'] + '）的' + $['name'] + '好友互助码】' + strMyShareId + '\x0a\x0a');
                         }
                         $['info'] = {
                             ...$['info'],
                             'SceneList': SceneList,
                             'XBDetail': XBDetail,
                             'dwXBRemainCnt': dwXBRemainCnt,
                             'ddwMoney': ddwMoney,
                             'dwIsNewUser': dwIsNewUser,
                             'strMyShareId': strMyShareId,
                             'strPin': strPin,
                             'dwLevel': dwLevel
                         };
                         _0x143878['kRuAF'](_0x44e9ab, {
                             'SceneList': SceneList,
                             'XBDetail': XBDetail,
                             'dwXBRemainCnt': dwXBRemainCnt,
                             'ddwMoney': ddwMoney,
                             'dwIsNewUser': dwIsNewUser,
                             'strMyShareId': strMyShareId,
                             'strPin': strPin
                         });
                     } else {
                         $['log']('\x0a' + taskinfo['strTaskDescr'] + '【领成就奖励】：该成就任务未达到门槛}');
                     }
                 }
             } catch (_0x9c56e5) {
                 if ('auPWA' !== _0x143878['gkmde']) {
                     _0x338bef = JSON['parse'](_0x338bef);
                     const {
                         iret,
                         SceneList = {},
                         XbStatus: {
                             XBDetail = [],
                             dwXBRemainCnt
                         } = {},
                         ddwMoney,
                         dwIsNewUser,
                         sErrMsg,
                         strMyShareId,
                         strPin,
                         dwLevel
                     } = _0x338bef;
                     $['log']('\n获取用户信息：' + sErrMsg + '\x0a' + ($['showLog'] ? _0x338bef : ''));
                     $['log']('\n当前等级:' + dwLevel + ',财富值:' + _0x338bef[_0x143878['pIXff']] + '\x0a');
                     if (_0x53b8b4) {
                         console['log']('财富岛好友互助码每次运行都变化,旧的可继续使用');
                         $['log']('\x0a【京东账号' + $['index'] + '（' + $['UserName'] + '）的' + $['name'] + '好友互助码】' + strMyShareId + '\x0a\x0a');
                     }
                     $['info'] = {
                         ...$['info'],
                         'SceneList': SceneList,
                         'XBDetail': XBDetail,
                         'dwXBRemainCnt': dwXBRemainCnt,
                         'ddwMoney': ddwMoney,
                         'dwIsNewUser': dwIsNewUser,
                         'strMyShareId': strMyShareId,
                         'strPin': strPin,
                         'dwLevel': dwLevel
                     };
                     _0x44e9ab({
                         'SceneList': SceneList,
                         'XBDetail': XBDetail,
                         'dwXBRemainCnt': dwXBRemainCnt,
                         'ddwMoney': ddwMoney,
                         'dwIsNewUser': dwIsNewUser,
                         'strMyShareId': strMyShareId,
                         'strPin': strPin
                     });
                 } else {
                     $['logErr'](_0x9c56e5, _0x576bb6);
                 }
             } finally {
                 _0x44e9ab();
             }
         });
     });
 }

 function querySignList() {
     var _0x3e9a39 = {
         'GsNBe': 'WQEoM',
         'igLok': 'qDgeD',
         'WksBQ': function(_0x37c2e7, _0x3043c6) {
             return _0x37c2e7 !== _0x3043c6;
         },
         'VvavS': 'rGsmf',
         'HXhYF': function(_0x56adae, _0x388157) {
             return _0x56adae(_0x388157);
         }
     };
     return new Promise(async _0x48899d => {
         $['get'](_0x3e9a39['HXhYF'](taskUrl, 'task/QuerySignListV2'), async (_0x36558d, _0x307477, _0xaddcf4) => {
             var _0x49d678 = {
                 'XptpH': function(_0xd9b5de, _0x4e13f7) {
                     return _0xd9b5de || _0x4e13f7;
                 }
             };
             if (_0x3e9a39['GsNBe'] === _0x3e9a39['igLok']) {
                 console['log']('' + JSON['stringify'](_0x36558d));
                 console['log']($['name'] + ' createSuperAssistUser JoinScene API请求失败，请检查网路重试');
             } else {
                 try {
                     if (_0x36558d) {
                         if ('DbUkU' !== 'DbUkU') {
                             console['log']('' + JSON['stringify'](_0x36558d));
                             console['log']($['name'] + ' TreasureHunt API请求失败，请检查网路重试');
                         } else {
                             console['log']('' + JSON['stringify'](_0x36558d));
                             console['log']($['name'] + ' QuerySignListV2 API请求失败，请检查网路重试');
                         }
                     } else {
                         const {
                             iRet,
                             sData: {
                                 Sign = [{}],
                                 dwUserFlag
                             },
                             sErrMsg
                         } = JSON['parse'](_0xaddcf4);
                         $['log']('\n签到列表：' + sErrMsg + '\x0a' + ($['showLog'] ? _0xaddcf4 : ''));
                         const [{
                             dwStatus,
                             ddwMoney
                         }] = Sign['filter'](_0x245fcc => _0x245fcc['dwShowFlag'] === 0x1);
                         if (dwStatus === 0x0) {
                             await userSignReward(dwUserFlag, ddwMoney);
                         } else {
                             if (_0x3e9a39['WksBQ']('DSgnn', 'DSgnn')) {
                                 if (_0x36558d) {
                                     console['log']('' + JSON['stringify'](_0x36558d));
                                     console['log']($['name'] + ' UserSignRewardV2 API请求失败，请检查网路重试');
                                 } else {
                                     const {
                                         iRet,
                                         sData: {
                                             ddwMoney
                                         },
                                         sErrMsg
                                     } = JSON['parse'](_0xaddcf4);
                                     $['log']('\n📌签到：' + sErrMsg + '，获得财富 ¥ ' + _0x49d678['XptpH'](ddwMoney, 0x0) + '\x0a' + ($['showLog'] ? _0xaddcf4 : ''));
                                 }
                             } else {
                                 $['log']('\n📌签到：你今日已签到过啦，请明天再来');
                             }
                         }
                     }
                 } catch (_0x4e11c4) {
                     if ('YLyzm' !== _0x3e9a39['VvavS']) {
                         $['logErr'](_0x4e11c4, _0x307477);
                     } else {
                         $['logErr'](_0x4e11c4, _0x307477);
                     }
                 } finally {
                     _0x48899d();
                 }
             }
         });
     });
 }
 async function userSignReward(_0x436087, _0x23f09c) {
     var _0x33d8d4 = {
         'kSfuy': function(_0x4122e6, _0x3a1340) {
             return _0x4122e6(_0x3a1340);
         },
         'yEqZo': 'https://h5.m.jd.com',
         'vCmkW': 'zh-cn',
         'cfSnF': function(_0x5b36e4, _0x2e9fdb) {
             return _0x5b36e4 > _0x2e9fdb;
         },
         'vHnJy': function(_0x480eaf, _0x5abdbc) {
             return _0x480eaf + _0x5abdbc;
         },
         'UWorn': 'yOkNV',
         'TqNtC': function(_0x30031d, _0x52507d) {
             return _0x30031d || _0x52507d;
         },
         'pwDYx': 'BoaCQ',
         'febCQ': function(_0x17fe9d, _0x265c65) {
             return _0x17fe9d === _0x265c65;
         }
     };
     return new Promise(async _0x5e038a => {
         var _0x19ae11 = {
             'YXDpb': function(_0x527c6d, _0x1c393d) {
                 return _0x33d8d4['kSfuy'](_0x527c6d, _0x1c393d);
             },
             'GPFEE': _0x33d8d4['yEqZo'],
             'qrlcu': _0x33d8d4['vCmkW'],
             'VtFCs': function(_0x5a4733, _0x5a98a5) {
                 return _0x33d8d4['cfSnF'](_0x5a4733, _0x5a98a5);
             },
             'KziGY': function(_0x449af3, _0x2e94a2) {
                 return _0x33d8d4['vHnJy'](_0x449af3, _0x2e94a2);
             },
             'Rsqji': function(_0x271b43, _0x3f2dac) {
                 return _0x271b43 === _0x3f2dac;
             },
             'AXREJ': 'RAqyB',
             'tPCmL': _0x33d8d4['UWorn'],
             'DxgUr': function(_0x27976a, _0x3e0be1) {
                 return _0x33d8d4['TqNtC'](_0x27976a, _0x3e0be1);
             },
             'eRotr': _0x33d8d4['pwDYx'],
             'SdjjN': function(_0x4f03cd) {
                 return _0x4f03cd();
             }
         };
         if (_0x33d8d4['febCQ']('rpVvQ', 'iRwXc')) {
             console['log']('' + JSON['stringify'](err));
             console['log']($['name'] + ' employeeAward API请求失败，请检查网路重试');
         } else {
             $['get'](taskUrl('task/UserSignRewardV2', 'dwReqUserFlag=' + _0x436087 + '&ddwMoney=' + _0x23f09c), async (_0x4f7127, _0x323b46, _0x4f2ed6) => {
                 var _0x3c2e6d = {
                     'mkMYa': function(_0x195bac, _0x5af1e5) {
                         return _0x19ae11['YXDpb'](_0x195bac, _0x5af1e5);
                     },
                     'GFXFd': 'api.m.jd.com',
                     'LCplk': 'application/json, text/plain, */*',
                     'HHFjv': _0x19ae11['GPFEE'],
                     'gOEtk': 'jdapp;iPhone;9.3.5;14.2;53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,2;addressid/137923973;supportBestPay/0;appBuild/167515;jdSupportDarkMode/0;pv/2217.74;apprpd/MyJD_PersonalSpace;ref/MySpace;psq/8;ads/;psn/53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2|8703;jdv/0|kong|t_1000170135|tuiguang|notset|1610674234917|1610674234;adk/;app_device/IOS;pap/JA2015_311210|9.3.5|IOS 14.2;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
                     'dvwgM': _0x19ae11['qrlcu'],
                     'pxmhG': function(_0x4ceebc, _0x113718) {
                         return _0x19ae11['VtFCs'](_0x4ceebc, _0x113718);
                     },
                     'fykWm': function(_0x3ddf61, _0x2b2498) {
                         return _0x3ddf61 * _0x2b2498;
                     },
                     'wrNyn': function(_0x145f66, _0x596aba) {
                         return _0x19ae11['KziGY'](_0x145f66, _0x596aba);
                     }
                 };
                 try {
                     if (_0x4f7127) {
                         if (_0x19ae11['Rsqji'](_0x19ae11['AXREJ'], _0x19ae11['AXREJ'])) {
                             console['log']('' + JSON['stringify'](_0x4f7127));
                             console['log']($['name'] + ' UserSignRewardV2 API请求失败，请检查网路重试');
                         } else {
                             if (_0x4f2ed6) {
                                 console['log']('随机取' + randomCount + '个码放到您固定的互助码后面(不影响已有固定互助)');
                                 _0x4f2ed6 = JSON['parse'](_0x4f2ed6);
                             }
                         }
                     } else {
                         if (_0x19ae11['tPCmL'] !== _0x19ae11['tPCmL']) {
                             const _0x285ab4 = {
                                 'url': 'https://api.m.jd.com/client.action?clientVersion=9.3.5&client=wh5&functionId=smtfission_assist&appid=smtFission&body=' + _0x3c2e6d['mkMYa'](escape, JSON['stringify'](vo)),
                                 'headers': {
                                     'Host': _0x3c2e6d['GFXFd'],
                                     'accept': _0x3c2e6d['LCplk'],
                                     'origin': _0x3c2e6d['HHFjv'],
                                     'user-agent': _0x3c2e6d['gOEtk'],
                                     'accept-language': _0x3c2e6d['dvwgM'],
                                     'referer': 'https://h5.m.jd.com/babelDiy/Zeus/25C6dc6HY6if6DT7e58A1pi2Vxe4/index.html?activityId=73cf1fe89d33433d9cc8688d1892d432&assistId=R2u2OCB9eEbcCVB_CiVKhg',
                                     'Cookie': cookie
                                 },
                                 'timeout': 0x2710
                             };
                             $['get'](_0x285ab4);
                         } else {
                             const {
                                 iRet,
                                 sData: {
                                     ddwMoney
                                 },
                                 sErrMsg
                             } = JSON['parse'](_0x4f2ed6);
                             $['log']('\x0a📌签到：' + sErrMsg + '，获得财富 ¥ ' + _0x19ae11['DxgUr'](ddwMoney, 0x0) + '\x0a' + ($['showLog'] ? _0x4f2ed6 : ''));
                         }
                     }
                 } catch (_0x458798) {
                     if (_0x19ae11['eRotr'] !== _0x19ae11['eRotr']) {
                         let _0x4eb3b3 = arr['slice'](0x0),
                             _0x3ee546 = arr['length'],
                             _0x29cc07 = _0x3ee546 - count,
                             _0x40ca87, _0x404363;
                         while (_0x3c2e6d['pxmhG'](_0x3ee546--, _0x29cc07)) {
                             _0x404363 = Math['floor'](_0x3c2e6d['fykWm'](_0x3c2e6d['wrNyn'](_0x3ee546, 0x1), Math['random']()));
                             _0x40ca87 = _0x4eb3b3[_0x404363];
                             _0x4eb3b3[_0x404363] = _0x4eb3b3[_0x3ee546];
                             _0x4eb3b3[_0x3ee546] = _0x40ca87;
                         }
                         return _0x4eb3b3['slice'](_0x29cc07);
                     } else {
                         $['logErr'](_0x458798, _0x323b46);
                     }
                 } finally {
                     _0x19ae11['SdjjN'](_0x5e038a);
                 }
             });
         }
     });
 }
 async function getMoney() {
     var _0xc66de1 = {
         'hZhNe': '1002',
         'dMnew': '1003',
         'pWZmq': function(_0xd507ec, _0x5b94e4) {
             return _0xd507ec >= _0x5b94e4;
         },
         'sHcDg': function(_0x423b11, _0x3d6375) {
             return _0x423b11 === _0x3d6375;
         },
         'bOrit': function(_0x4b4166, _0x2f55f2) {
             return _0x4b4166 + _0x2f55f2;
         },
         'tCVHv': 'LDTws',
         'OqvGY': 'imkGg',
         'weWLs': function(_0x2b254c, _0x3dd86f, _0x5854f4, _0x19fae0) {
             return _0x2b254c(_0x3dd86f, _0x5854f4, _0x19fae0);
         },
         'FeIoW': function(_0x756a3c, _0x40f68a) {
             return _0x756a3c(_0x40f68a);
         }
     };
     let _0x469a9a = $['info']['SceneList'];
     let _0x1ded5d = [],
         _0x422f17 = ['1001', _0xc66de1['hZhNe'], _0xc66de1['dMnew']];
     _0x1ded5d = Object['keys'](_0x469a9a);
     _0x1ded5d = _0x422f17['filter'](_0x319c7c => _0x1ded5d['every'](_0x1158b5 => _0x319c7c !== _0x1158b5));
     console['log']('待开通场景ID列表sceneList;' + JSON['stringify'](_0x1ded5d));
     for (let _0x38b3c2 of _0x1ded5d) {
         if (_0x38b3c2 === _0xc66de1['hZhNe'] && _0xc66de1['pWZmq']($['info']['dwLevel'], 0xb)) await activeScene(_0x38b3c2);
         if (_0xc66de1['sHcDg'](_0x38b3c2, _0xc66de1['dMnew']) && _0xc66de1['pWZmq']($['info']['dwLevel'], 0x1a)) await activeScene(_0x38b3c2);
     }
     for (const _0x2e3345 of Object['keys']($['info']['SceneList'])) {
         await $['wait'](0x7d0);
         await getMoney_dwSource_1(_0x2e3345, _0x469a9a);
         const _0x2b0b72 = eval(_0xc66de1['bOrit']('(' + JSON['stringify'](_0x469a9a[_0x2e3345]['EmployeeList']), ')'));
         if (_0x2b0b72 !== '') {
             if (_0xc66de1['tCVHv'] !== _0xc66de1['OqvGY']) {
                 for (var _0x5488c0 of Object['keys'](_0x2b0b72)) {
                     await $['wait'](0x7d0);
                     await _0xc66de1['weWLs'](getMoney_dwSource_2, _0x2e3345, _0x469a9a, _0x5488c0);
                 }
             } else {
                 $['newShareCodes'] = [...new Set([...$['newShareCodes'], ...$['strMyShareIds'], 'AE9A1A36CE90E035A19DC751D9557899D5ED1C1C67FD467D91E4D0DE3930D809', ...readShareCodeRes['data'] || []])];
             }
         }
         await $['wait'](0x7d0);
         if (token) await getMoney_dwSource_3(_0x2e3345, _0x469a9a);
         await _0xc66de1['FeIoW'](employeeAward, _0x2e3345);
     }
 }

 function getMoney_dwSource_1(_0x3fc1cf, _0x1776fb) {
     var _0x37e5f6 = {
         'swXUv': 'TVCbQ',
         'LAyiG': function(_0x2487a2, _0x35da99) {
             return _0x2487a2 == _0x35da99;
         },
         'Zvauc': function(_0x5751ba, _0x4472bb) {
             return _0x5751ba || _0x4472bb;
         },
         'vlehB': function(_0x563b8e, _0x266282) {
             return _0x563b8e !== _0x266282;
         },
         'vpqMw': 'LogxW',
         'uWDFN': 'alDQY',
         'EOusT': function(_0x28f208, _0x6fddf1, _0x227b41) {
             return _0x28f208(_0x6fddf1, _0x227b41);
         }
     };
     return new Promise(async _0x172885 => {
         $['get'](_0x37e5f6['EOusT'](taskUrl, 'user/GetMoney', 'dwSceneId=' + _0x3fc1cf + '&strEmployeeId=undefined&dwSource=1'), async (_0x15ea01, _0x15eae2, _0x200761) => {
             if (_0x37e5f6['swXUv'] !== _0x37e5f6['swXUv']) {
                 console['log']('' + JSON['stringify'](_0x15ea01));
                 console['log']($['name'] + ' OpenGroup API请求失败，请检查网路重试');
             } else {
                 try {
                     if (_0x15ea01) {
                         console['log']('' + JSON['stringify'](_0x15ea01));
                         console['log']($['name'] + ' getMoney_dwSource_1 API请求失败，请检查网路重试');
                     } else {
                         const {
                             iRet,
                             dwMoney,
                             sErrMsg
                         } = JSON['parse'](_0x200761);
                         $['log']('\x0a【' + _0x1776fb[_0x3fc1cf]['strSceneName'] + '】🏝岛主 : ' + (_0x37e5f6['LAyiG'](sErrMsg, 'success') ? '获取财富值：¥ ' + _0x37e5f6['Zvauc'](dwMoney, 0x0) : sErrMsg) + ' \x0a' + ($['showLog'] ? _0x200761 : ''));
                     }
                 } catch (_0x1ce614) {
                     if (_0x37e5f6['vlehB'](_0x37e5f6['vpqMw'], _0x37e5f6['uWDFN'])) {
                         $['logErr'](_0x1ce614, _0x15eae2);
                     } else {
                         console['log']('' + JSON['stringify'](_0x15ea01));
                         console['log']($['name'] + ' joinGroup API请求失败，请检查网路重试');
                     }
                 } finally {
                     _0x172885();
                 }
             }
         });
     });
 }

 function getMoney_dwSource_2(_0x5b746a, _0x17e80f, _0x28dd2d) {
     var _0x437f02 = {
         'mQPfZ': function(_0x5b96f7) {
             return _0x5b96f7();
         },
         'ycnUc': 'cPkMx',
         'gOECM': 'RcrLf',
         'fAgMZ': 'success',
         'jtQvI': function(_0x58b007, _0x495d65) {
             return _0x58b007 === _0x495d65;
         },
         'RoEoq': 'DqKsM',
         'HBGGO': 'NlJhP',
         'LgohS': function(_0x43780c, _0x4cf623, _0x143419) {
             return _0x43780c(_0x4cf623, _0x143419);
         }
     };
     return new Promise(async _0x232d3e => {
         var _0x3c5c00 = {
             'AykDG': function(_0x153a15) {
                 return _0x437f02['mQPfZ'](_0x153a15);
             },
             'YfcDG': function(_0x366ac9, _0x3295b2) {
                 return _0x366ac9 !== _0x3295b2;
             },
             'xewqN': _0x437f02['ycnUc'],
             'KiNQJ': _0x437f02['gOECM'],
             'UcKDI': 'vbEyZ',
             'zlOWO': _0x437f02['fAgMZ'],
             'ooRmz': function(_0x2426e3, _0x2a4e77) {
                 return _0x2426e3 || _0x2a4e77;
             },
             'SnqCx': function(_0x4942a4, _0x174dac) {
                 return _0x437f02['jtQvI'](_0x4942a4, _0x174dac);
             },
             'cuChP': _0x437f02['RoEoq'],
             'hGaBB': _0x437f02['HBGGO']
         };
         $['get'](_0x437f02['LgohS'](taskUrl, 'user/GetMoney', 'dwSceneId=' + _0x5b746a + '&strEmployeeId=' + _0x28dd2d + '&dwSource=2'), async (_0x2a3cd4, _0x133d15, _0x376128) => {
             try {
                 if (_0x3c5c00['YfcDG']('cPkMx', _0x3c5c00['xewqN'])) {
                     console['log']('' + JSON['stringify'](_0x2a3cd4));
                     console['log']($['name'] + ' DoTask API请求失败，请检查网路重试');
                 } else {
                     if (_0x2a3cd4) {
                         if (_0x3c5c00['YfcDG'](_0x3c5c00['KiNQJ'], _0x3c5c00['UcKDI'])) {
                             console['log']('' + JSON['stringify'](_0x2a3cd4));
                             console['log']($['name'] + ' getMoney_dwSource_2 API请求失败，请检查网路重试');
                         } else {
                             $['logErr'](e, _0x133d15);
                         }
                     } else {
                         const {
                             dwMoney,
                             iRet,
                             sErrMsg,
                             strPin
                         } = JSON['parse'](_0x376128);
                         $['log']('\x0a【' + _0x17e80f[_0x5b746a]['strSceneName'] + '】👬好友: ' + (sErrMsg == _0x3c5c00['zlOWO'] ? '获取普通助力财富值：¥ ' + _0x3c5c00['ooRmz'](dwMoney, 0x0) : sErrMsg) + ' \x0a' + ($['showLog'] ? _0x376128 : ''));
                     }
                 }
             } catch (_0x40e092) {
                 if (_0x3c5c00['SnqCx'](_0x3c5c00['cuChP'], _0x3c5c00['hGaBB'])) {
                     _0x3c5c00['AykDG'](_0x232d3e);
                 } else {
                     $['logErr'](_0x40e092, _0x133d15);
                 }
             } finally {
                 _0x3c5c00['AykDG'](_0x232d3e);
             }
         });
     });
 }

 function getMoney_dwSource_3(_0x3e20b1, _0x142f8e) {
     var _0x1fbb83 = {
         'XTXXu': function(_0xcede3e, _0x2da4b8) {
             return _0xcede3e !== _0x2da4b8;
         },
         'lwQvS': 'eXROQ',
         'MStpS': 'Dxcju',
         'waUbE': function(_0x57b039, _0x48e403) {
             return _0x57b039 == _0x48e403;
         },
         'arLKX': 'success',
         'knQGG': function(_0x47ee75, _0x267e4c) {
             return _0x47ee75 || _0x267e4c;
         },
         'zCuvT': function(_0x5598f4, _0x1c1ee9) {
             return _0x5598f4 === _0x1c1ee9;
         },
         'tRLnw': 'ClQwJ',
         'QtkoT': function(_0x4cdead) {
             return _0x4cdead();
         },
         'dKIWb': function(_0x45cc46, _0x25019a, _0x1f2338) {
             return _0x45cc46(_0x25019a, _0x1f2338);
         },
         'neFFH': 'timestamp',
         'JUBNA': 'phoneid',
         'BWYQU': 'farm_jstoken'
     };
     return new Promise(async _0x49a083 => {
         $['get'](_0x1fbb83['dKIWb'](taskUrl, 'user/GetMoney', 'dwSceneId=' + _0x3e20b1 + '&strEmployeeId=&dwSource=3&strPgtimestamp=' + token[_0x1fbb83['neFFH']] + '&strPhoneID=' + token[_0x1fbb83['JUBNA']] + '&strPgUUNum=' + token[_0x1fbb83['BWYQU']]), async (_0x40385f, _0x193171, _0x2fd67d) => {
             try {
                 if (_0x40385f) {
                     if (_0x1fbb83['XTXXu'](_0x1fbb83['lwQvS'], _0x1fbb83['MStpS'])) {
                         console['log']('' + JSON['stringify'](_0x40385f));
                         console['log']($['name'] + ' getMoney_dwSource_3 API请求失败，请检查网路重试');
                     } else {
                         _0x49a083();
                     }
                 } else {
                     const {
                         iRet,
                         dwMoney,
                         sErrMsg,
                         strPin
                     } = JSON['parse'](_0x2fd67d);
                     $['log']('\x0a【' + _0x142f8e[_0x3e20b1]['strSceneName'] + '】👬好友: ' + (_0x1fbb83['waUbE'](sErrMsg, _0x1fbb83['arLKX']) ? '获取超级助力财富值：¥ ' + _0x1fbb83['knQGG'](dwMoney, 0x0) : sErrMsg) + ' \x0a' + ($['showLog'] ? _0x2fd67d : ''));
                 }
             } catch (_0x1abde2) {
                 $['logErr'](_0x1abde2, _0x193171);
             } finally {
                 if (_0x1fbb83['zCuvT'](_0x1fbb83['tRLnw'], _0x1fbb83['tRLnw'])) {
                     _0x1fbb83['QtkoT'](_0x49a083);
                 } else {
                     _0x49a083();
                 }
             }
         });
     });
 }

 function employeeAward(_0x3ff683) {
     var _0x1ebe2a = {
         'rPCkY': function(_0x5a977b, _0x1c7c0e) {
             return _0x5a977b !== _0x1c7c0e;
         },
         'ZOFDp': '活动太火爆了',
         'cJcLq': '任务为成就任务或者未到任务时间',
         'VUTxn': function(_0x1795fa, _0x51eb07) {
             return _0x1795fa(_0x51eb07);
         },
         'zDWyE': function(_0xf13c11, _0x448e90) {
             return _0xf13c11 === _0x448e90;
         },
         'RhnQW': function(_0x2b2d86) {
             return _0x2b2d86();
         },
         'vegvG': 'ghkRn',
         'VfcDA': 'SKsBI',
         'dhBiM': '1001',
         'ZENEC': '1003',
         'pzBmH': 'cLiJU',
         'vNVhm': 'UPXXt',
         'zmVPZ': function(_0x14a2f7, _0x3b81b0) {
             return _0x14a2f7(_0x3b81b0);
         },
         'OjkDO': 'GnmAC',
         'uZSqq': function(_0x2817ba, _0x44737e) {
             return _0x2817ba !== _0x44737e;
         },
         'SktXN': 'vmaKK',
         'piwNE': 'm.jingxi.com',
         'FJhOI': '*/*',
         'ZmmcZ': 'zh-cn',
         'tYiSz': 'https://st.jingxi.com/fortune_island/index.html?ptag=7155.9.47'
     };
     return new Promise(async _0x45afe7 => {
         var _0x1e2ba1 = {
             'kXrFV': function(_0x573968, _0x2d08eb) {
                 return _0x1ebe2a['rPCkY'](_0x573968, _0x2d08eb);
             },
             'HCAkD': _0x1ebe2a['ZOFDp'],
             'DNtuI': _0x1ebe2a['cJcLq'],
             'vVlqC': function(_0x5765b7, _0x26c6dc) {
                 return _0x5765b7 + _0x26c6dc;
             },
             'kdUhZ': function(_0x2fd09d, _0x1542e4) {
                 return _0x1ebe2a['VUTxn'](_0x2fd09d, _0x1542e4);
             },
             'fDMsN': function(_0x3738fa, _0x553225) {
                 return _0x3738fa === _0x553225;
             },
             'iCmtC': function(_0x29fa47, _0x371a59) {
                 return _0x1ebe2a['zDWyE'](_0x29fa47, _0x371a59);
             },
             'VpFOV': function(_0x4b2000) {
                 return _0x1ebe2a['RhnQW'](_0x4b2000);
             },
             'zYeNJ': _0x1ebe2a['vegvG'],
             'wcXFv': 'IJzIO',
             'QUBpv': _0x1ebe2a['VfcDA'],
             'CUfQr': function(_0x50b3ba, _0x2ddf7b) {
                 return _0x1ebe2a['zDWyE'](_0x50b3ba, _0x2ddf7b);
             },
             'REbnS': function(_0x59353a, _0x1a63eb) {
                 return _0x1ebe2a['zDWyE'](_0x59353a, _0x1a63eb);
             },
             'zJiVG': _0x1ebe2a['dhBiM'],
             'KgBIQ': '1002',
             'CFuij': 'strName',
             'ZKkkZ': _0x1ebe2a['ZENEC'],
             'jHaXU': _0x1ebe2a['pzBmH'],
             'rVVbe': _0x1ebe2a['vNVhm'],
             'LbhaA': function(_0x4b4177, _0x32e3da) {
                 return _0x4b4177 * _0x32e3da;
             },
             'MHtXc': function(_0x5370cf, _0xde4667) {
                 return _0x1ebe2a['zmVPZ'](_0x5370cf, _0xde4667);
             },
             'RQPoj': _0x1ebe2a['OjkDO']
         };
         if (_0x1ebe2a['uZSqq'](_0x1ebe2a['SktXN'], 'vmaKK')) {
             console['log']('' + JSON['stringify'](err));
             console['log']($['name'] + ' FriendCircle API请求失败，请检查网路重试');
         } else {
             const _0x222f79 = {
                 'url': 'https://m.jingxi.com/jxcfd/user/AdvEmployeeAward?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=' + +new Date() + '&ptag=138631.26.55&dwSenceId=' + _0x3ff683 + '&_=' + +new Date() + '&_stk=_cfd_t,bizCode,dwEnv,dwSenceId,ptag,source,strZone&h5st=20210304120622242;6980827292145544;10009;tk01wb8321c0ea8nNjg0a1JqVUlvqre776hbVd8Unm3xaodPUoxF6qk2nu5+3BL0+M/NCPfMBRDekvWYG0otooxd4ZA9;3a499b12485ae55f84ace34682b6bececd1e74be6ae82d880877f9e1c861d7d9&sceneval=2&g_login_type=1',
                 'headers': {
                     'Host': _0x1ebe2a['piwNE'],
                     'accept': _0x1ebe2a['FJhOI'],
                     'user-agent': 'jdpingou;iPad;4.2.2;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                     'accept-language': _0x1ebe2a['ZmmcZ'],
                     'referer': _0x1ebe2a['tYiSz'],
                     'Cookie': cookie
                 }
             };
             $['get'](_0x222f79, async (_0x4b6f54, _0x492eed, _0x4a4afd) => {
                 var _0x777318 = {
                     'mwPiX': function(_0xe48d73, _0x451eac) {
                         return _0x1e2ba1['iCmtC'](_0xe48d73, _0x451eac);
                     },
                     'xJLyg': function(_0x393dab, _0x5180ae) {
                         return _0x1e2ba1['iCmtC'](_0x393dab, _0x5180ae);
                     },
                     'simoo': function(_0x2c086b) {
                         return _0x1e2ba1['VpFOV'](_0x2c086b);
                     }
                 };
                 try {
                     if (_0x4b6f54) {
                         if ('ghkRn' === _0x1e2ba1['zYeNJ']) {
                             console['log']('' + JSON['stringify'](_0x4b6f54));
                             console['log']($['name'] + ' employeeAward API请求失败，请检查网路重试');
                         } else {
                             $['logErr'](e, _0x492eed);
                         }
                     } else {
                         if (_0x1e2ba1['wcXFv'] === _0x1e2ba1['QUBpv']) {
                             $['log']('\x0a【🏝寻宝大作战】【' + strBrandName + '】开宝箱：未达到宝箱开启条件，快去邀请好友助力吧！');
                             _0x45afe7();
                         } else {
                             const {
                                 iRet,
                                 sErrMsg,
                                 strAwardDetail
                             } = JSON['parse'](_0x4a4afd);
                             if (_0x1e2ba1['CUfQr'](iRet, 0x0)) {
                                 if (_0x1e2ba1['REbnS']('jUENI', 'czlzS')) {
                                     const {
                                         msg,
                                         ret,
                                         data: {
                                             prizeInfo = ''
                                         } = {}
                                     } = JSON['parse'](_0x4a4afd);
                                     let _0x9642e4 = '';
                                     if (_0x1e2ba1['kXrFV'](msg['indexOf'](_0x1e2ba1['HCAkD']), -0x1)) {
                                         _0x9642e4 = _0x1e2ba1['DNtuI'];
                                     } else {
                                         _0x9642e4 = _0x1e2ba1['vVlqC'](msg, prizeInfo) ? ' 获得财富值 ¥ ' + JSON['parse'](prizeInfo)['ddwMoney'] : '';
                                     }
                                     $['log']('\x0a' + taskName + '【领日常奖励】：' + _0x9642e4 + '\x0a' + ($['showLog'] ? _0x4a4afd : ''));
                                     _0x1e2ba1['kdUhZ'](_0x45afe7, _0x1e2ba1['fDMsN'](ret, 0x0));
                                 } else {
                                     switch (_0x3ff683) {
                                         case _0x1e2ba1['zJiVG']:
                                             console['log']('【欢乐牧场】获得 ' + strAwardDetail['strName'] + ' 红包');
                                             break;
                                         case _0x1e2ba1['KgBIQ']:
                                             console['log']('【便利店】获得 ' + strAwardDetail[_0x1e2ba1['CFuij']] + ' 红包');
                                             break;
                                         case _0x1e2ba1['ZKkkZ']:
                                             console['log']('【京喜餐厅】获得 ' + strAwardDetail[_0x1e2ba1['CFuij']] + ' 红包');
                                             break;
                                         default:
                                             console['log']('【未知场景】获得 ' + strAwardDetail[_0x1e2ba1['CFuij']] + ' 红包');
                                     }
                                 }
                             } else {
                                 if (_0x1e2ba1['REbnS'](_0x1e2ba1['jHaXU'], _0x1e2ba1['jHaXU'])) {
                                     switch (_0x3ff683) {
                                         case '1001':
                                             console['log']('【欢乐牧场领取红包】 ' + sErrMsg);
                                             break;
                                         case _0x1e2ba1['KgBIQ']:
                                             console['log']('【便利店领取红包】' + sErrMsg);
                                             break;
                                         case _0x1e2ba1['ZKkkZ']:
                                             console['log']('【京喜餐厅领取红包】' + sErrMsg);
                                             break;
                                         default:
                                             console['log']('【未知场景领取红包】' + sErrMsg);
                                     }
                                 } else {
                                     const {
                                         sErrMsg,
                                         iRet
                                     } = _0x4a4afd = JSON['parse'](_0x4a4afd);
                                     if (_0x777318['mwPiX'](iRet, 0x7d5) || _0x777318['xJLyg'](iRet, 0x270f)) $['canHelp'] = ![];
                                     $['log']('iRet:' + iRet + ' ' + sErrMsg);
                                 }
                             }
                             if (_0x1e2ba1['kXrFV'](iRet, 0x0)) {
                                 if (_0x1e2ba1['rVVbe'] !== _0x1e2ba1['rVVbe']) {
                                     _0x777318['simoo'](_0x45afe7);
                                 } else {
                                     return;
                                 }
                             }
                             await $['wait'](_0x1e2ba1['LbhaA'](0x2, 0x3e8));
                             await _0x1e2ba1['MHtXc'](employeeAward, _0x3ff683);
                         }
                     }
                 } catch (_0x53272e) {
                     $['logErr'](_0x53272e, _0x492eed);
                 } finally {
                     if (_0x1e2ba1['RQPoj'] === _0x1e2ba1['RQPoj']) {
                         _0x45afe7();
                     } else {
                         if (_0x4b6f54) {
                             console['log']('' + JSON['stringify'](_0x4b6f54));
                             console['log']($['name'] + ' createSuperAssistUser JoinScene API请求失败，请检查网路重试');
                         } else {
                             console['log']('超级助力(超级工人)结果:' + _0x4a4afd);
                             const {
                                 sErrMsg,
                                 iRet
                             } = JSON['parse'](_0x4a4afd);
                             if (_0x777318['xJLyg'](iRet, 0x7d5) || iRet === 0x270f) $['canHelp'] = ![];
                         }
                     }
                 }
             });
         }
     });
 }

 function friendCircle() {
     var _0xcbff90 = {
         'UNveg': function(_0x1296e1, _0x5e1e28) {
             return _0x1296e1 !== _0x5e1e28;
         },
         'XjdMP': 'aYhRB',
         'bihan': 'FXSyJ',
         'FqIak': 'eDdKa',
         'lzWTc': function(_0x29fed4, _0x2be3dd) {
             return _0x29fed4 !== _0x2be3dd;
         },
         'aEDNp': 'eLfRK',
         'ARBeY': 'KiUVk',
         'biMRt': function(_0x583b4d) {
             return _0x583b4d();
         },
         'RmsGR': function(_0x1046e7, _0x3ed6c4) {
             return _0x1046e7 || _0x3ed6c4;
         },
         'BglzQ': function(_0x38a449, _0x2410eb) {
             return _0x38a449(_0x2410eb);
         },
         'KKcjR': function(_0x26b34e, _0x3eb7c3, _0x5853da) {
             return _0x26b34e(_0x3eb7c3, _0x5853da);
         }
     };
     return new Promise(async _0x43b187 => {
         var _0x3576c7 = {
             'UgsGk': function(_0x526e78, _0x5953a1) {
                 return _0xcbff90['RmsGR'](_0x526e78, _0x5953a1);
             },
             'prUot': function(_0x4d6ec9, _0x3afa6d) {
                 return _0xcbff90['BglzQ'](_0x4d6ec9, _0x3afa6d);
             }
         };
         $['get'](_0xcbff90['KKcjR'](taskUrl, 'user/FriendCircle', 'dwPageIndex=1&dwPageSize=20'), async (_0x18d17f, _0x3abe38, _0x543dd7) => {
             if (_0xcbff90['UNveg'](_0xcbff90['XjdMP'], _0xcbff90['bihan'])) {
                 try {
                     if (_0x18d17f) {
                         console['log']('' + JSON['stringify'](_0x18d17f));
                         console['log']($['name'] + ' FriendCircle API请求失败，请检查网路重试');
                     } else {
                         const {
                             MomentList = [], iRet, sErrMsg, strShareId
                         } = JSON['parse'](_0x543dd7);
                         for (moment of MomentList) {
                             if (_0xcbff90['FqIak'] !== _0xcbff90['FqIak']) {
                                 console['log']('随机取' + randomCount + '个码放到您固定的互助码后面(不影响已有固定互助)');
                                 _0x543dd7 = JSON['parse'](_0x543dd7);
                             } else {
                                 if (_0xcbff90['UNveg'](moment['strShareId'], strShareId) && moment['dwAccessMoney'] > 0x0) {
                                     await queryFriendIsland(moment['strShareId']);
                                     await $['wait'](0x1f4);
                                 }
                             }
                         }
                     }
                 } catch (_0x21154c) {
                     $['logErr'](_0x21154c, _0x3abe38);
                 } finally {
                     if (_0xcbff90['lzWTc'](_0xcbff90['aEDNp'], _0xcbff90['ARBeY'])) {
                         _0xcbff90['biMRt'](_0x43b187);
                     } else {
                         const {
                             iRet,
                             dwExpericnce,
                             sErrMsg
                         } = JSON['parse'](_0x543dd7);
                         $['log']('\x0a【' + place + '】🎁寻宝：' + sErrMsg + ' ，获取随机奖励：¥ ' + _0x3576c7['UgsGk'](dwExpericnce, 0x0) + ' \x0a' + ($['showLog'] ? _0x543dd7 : ''));
                         _0x3576c7['prUot'](_0x43b187, iRet);
                     }
                 }
             } else {
                 console['log']('' + JSON['stringify'](_0x18d17f));
                 console['log']($['name'] + ' UserSignRewardV2 API请求失败，请检查网路重试');
             }
         });
     });
 }

 function queryFriendIsland(_0x3f0b8c) {
     var _0x593721 = {
         'UyriO': 'xGEEM',
         'fqgak': 'MNsOq',
         'VCCyf': 'jcYWc',
         'MfDIh': function(_0x5ca0f9, _0xdf5b95) {
             return _0x5ca0f9 === _0xdf5b95;
         },
         'ZgHuW': function(_0x2c0dae, _0x58f750) {
             return _0x2c0dae + _0x58f750;
         },
         'ujgjV': function(_0x10f7bf, _0x244926, _0x3e23dc, _0x59d42a, _0x3de545) {
             return _0x10f7bf(_0x244926, _0x3e23dc, _0x59d42a, _0x3de545);
         },
         'HvDhe': 'kspmY',
         'jChXw': 'SugPb',
         'YpYXW': function(_0xb6e7cc, _0x41a3d8, _0x1dfba4) {
             return _0xb6e7cc(_0x41a3d8, _0x1dfba4);
         }
     };
     return new Promise(async _0x2349f6 => {
         var _0x2142a7 = {
             'UklRn': _0x593721['UyriO'],
             'KkACa': _0x593721['fqgak'],
             'TAmeA': _0x593721['VCCyf'],
             'fWBSv': function(_0x2ff4fd, _0x367ebb) {
                 return _0x593721['MfDIh'](_0x2ff4fd, _0x367ebb);
             },
             'ZNqzf': function(_0x3fd664, _0x3dc2a1) {
                 return _0x3fd664(_0x3dc2a1);
             },
             'GAivS': function(_0x153292, _0x8f3577) {
                 return _0x593721['ZgHuW'](_0x153292, _0x8f3577);
             },
             'GUZqx': function(_0xb5e46a, _0x193b20, _0x3909b5, _0x62f096, _0x2b05b6) {
                 return _0x593721['ujgjV'](_0xb5e46a, _0x193b20, _0x3909b5, _0x62f096, _0x2b05b6);
             },
             'sHOdi': _0x593721['HvDhe'],
             'dFNix': _0x593721['jChXw'],
             'ybkOr': function(_0x20317d) {
                 return _0x20317d();
             }
         };
         if ('MZiDz' === 'MZiDz') {
             $['get'](_0x593721['YpYXW'](taskUrl, 'user/QueryFriendIsland', 'strShareId=' + _0x3f0b8c + '&sceneval=2'), async (_0x5f97a5, _0x4638d6, _0x12208) => {
                 try {
                     if ('UWiim' !== 'UWiim') {
                         $['logErr'](e, _0x4638d6);
                     } else {
                         if (_0x5f97a5) {
                             if (_0x2142a7['UklRn'] !== _0x2142a7['KkACa']) {
                                 console['log']('' + JSON['stringify'](_0x5f97a5));
                                 console['log']($['name'] + ' QueryFriendIsland API请求失败，请检查网路重试');
                             } else {
                                 cookiesArr['push'](jdCookieNode[item]);
                             }
                         } else {
                             if (_0x2142a7['TAmeA'] === 'WYPGb') {
                                 $['logErr'](e, _0x4638d6);
                             } else {
                                 const {
                                     SceneList = {}, dwStealMoney, sErrMsg, strFriendNick
                                 } = JSON['parse'](_0x12208);
                                 if (_0x2142a7['fWBSv'](sErrMsg, 'success')) {
                                     const _0x517c0a = _0x2142a7['ZNqzf'](eval, _0x2142a7['GAivS'](_0x2142a7['GAivS']('(', JSON['stringify'](SceneList)), ')'));
                                     const _0x157bdf = Object['keys'](SceneList);
                                     for (sceneId of _0x157bdf) {
                                         await _0x2142a7['GUZqx'](stealMoney, _0x3f0b8c, sceneId, strFriendNick, _0x517c0a[sceneId]['strSceneName']);
                                         await $['wait'](0x1f4);
                                     }
                                 }
                             }
                         }
                     }
                 } catch (_0x5c60ef) {
                     if (_0x2142a7['fWBSv'](_0x2142a7['sHOdi'], _0x2142a7['dFNix'])) {
                         $['logErr'](_0x5c60ef, _0x4638d6);
                     } else {
                         $['logErr'](_0x5c60ef, _0x4638d6);
                     }
                 } finally {
                     _0x2142a7['ybkOr'](_0x2349f6);
                 }
             });
         } else {
             const {
                 iRet,
                 sErrMsg,
                 taskinfo = []
             } = JSON['parse'](data);
             $['allTask'] = taskinfo['filter'](_0x11e05d => _0x11e05d['dwAwardStatus'] === 0x1);
             $['log']('\n获取【🎖成就任务】列表 ' + sErrMsg + '，总共' + $['allTask']['length'] + '个任务！\x0a' + ($['showLog'] ? data : ''));
         }
     });
 }

 function stealMoney(_0x59fcc4, _0x246772, _0x558d9d, _0x59bf6b) {
     var _0xe4ec7e = {
         'YkRfd': function(_0x2ccf69) {
             return _0x2ccf69();
         },
         'jIwuj': 'abcdefghijklmnopqrstuvwxyz1234567890',
         'XwkQc': function(_0x56e427, _0x1ad2be) {
             return _0x56e427(_0x1ad2be);
         },
         'gRTBh': function(_0x21508f, _0x25d1f9) {
             return _0x21508f * _0x25d1f9;
         },
         'zwxYi': function(_0x2e0ecd, _0xe5e35d) {
             return _0x2e0ecd !== _0xe5e35d;
         },
         'yGmjK': 'Bwdxw',
         'KhRXc': function(_0x2e3055, _0x50b27e) {
             return _0x2e3055 === _0x50b27e;
         },
         'ZznbU': 'QOMEz',
         'QPSHD': 'Cykvu',
         'sbKYs': function(_0x3da603, _0x595f02, _0x3f156f) {
             return _0x3da603(_0x595f02, _0x3f156f);
         }
     };
     return new Promise(async _0x521aba => {
         if (_0xe4ec7e['QPSHD'] !== 'rCqcl') {
             $['get'](_0xe4ec7e['sbKYs'](taskUrl, 'user/StealMoney', 'strFriendId=' + _0x59fcc4 + '&dwSceneId=' + _0x246772 + '&sceneval=2'), async (_0x3f07f0, _0x18a2fe, _0x418f38) => {
                 var _0x215866 = {
                     'jKYeK': function(_0x2a5709) {
                         return _0xe4ec7e['YkRfd'](_0x2a5709);
                     },
                     'SdyHB': _0xe4ec7e['jIwuj'],
                     'ygxBR': function(_0x5676a7, _0x2c5613) {
                         return _0x5676a7 < _0x2c5613;
                     },
                     'GFRpZ': function(_0x2746e4, _0x132bc6) {
                         return _0xe4ec7e['XwkQc'](_0x2746e4, _0x132bc6);
                     },
                     'HxxKB': function(_0x19ae2f, _0x5cbc03) {
                         return _0xe4ec7e['gRTBh'](_0x19ae2f, _0x5cbc03);
                     }
                 };
                 if (_0xe4ec7e['zwxYi'](_0xe4ec7e['yGmjK'], _0xe4ec7e['yGmjK'])) {
                     _0x215866['jKYeK'](_0x521aba);
                 } else {
                     try {
                         if (_0x3f07f0) {
                             if (_0xe4ec7e['KhRXc'](_0xe4ec7e['ZznbU'], 'ElXid')) {
                                 let _0x4875b6 = _0x215866['SdyHB'];
                                 let _0x4bcffb = '';
                                 for (let _0x120785 = 0x0; _0x215866['ygxBR'](_0x120785, count); _0x120785++) {
                                     _0x4bcffb += _0x4875b6[_0x215866['GFRpZ'](parseInt, _0x215866['HxxKB'](Math['random'](), _0x4875b6['length']))];
                                 }
                                 return _0x4bcffb;
                             } else {
                                 console['log']('' + JSON['stringify'](_0x3f07f0));
                                 console['log']($['name'] + ' StealMoney API请求失败，请检查网路重试');
                             }
                         } else {
                             const {
                                 dwGetMoney,
                                 iRet,
                                 sErrMsg
                             } = JSON['parse'](_0x418f38);
                             $['log']('\n🤏偷取好友【' + _0x558d9d + '】【' + _0x59bf6b + '】财富值：¥ ' + (dwGetMoney ? dwGetMoney : sErrMsg) + '\x0a' + ($['showLog'] ? _0x418f38 : ''));
                         }
                     } catch (_0xfd3632) {
                         $['logErr'](_0xfd3632, _0x18a2fe);
                     } finally {
                         _0x521aba();
                     }
                 }
             });
         } else {
             _0x521aba();
         }
     });
 }
 async function treasureHunt() {
     var _0x23c5a1 = {
         'VdruU': function(_0x4883ca) {
             return _0x4883ca();
         },
         'QmkEf': function(_0x491f8f, _0x213d4c) {
             return _0x491f8f < _0x213d4c;
         },
         'xXCUm': function(_0x497f59, _0x28439a) {
             return _0x497f59 > _0x28439a;
         },
         'fprqD': 'LqpNs',
         'xyzbS': function(_0x51f234, _0x30050b) {
             return _0x51f234(_0x30050b);
         },
         'wvLYl': 'KCqbl'
     };
     if ($['info']['dwXBRemainCnt'] > 0x0) {
         const _0x4df3f8 = $['info']['XBDetail'];
         for (let _0x10c475 = 0x0; _0x23c5a1['QmkEf'](_0x10c475, _0x4df3f8['length']); _0x10c475++) {
             const {
                 ddwColdEndTm,
                 strIndex
             } = _0x4df3f8[_0x10c475];
             const _0x29af00 = Math['round'](new Date() / 0x3e8);
             if (_0x23c5a1['xXCUm'](_0x29af00, ddwColdEndTm)) {
                 if (_0x23c5a1['fprqD'] !== 'oomDu') {
                     await _0x23c5a1['xyzbS'](doTreasureHunt, strIndex);
                     await $['wait'](0xbb8);
                 } else {
                     _0x23c5a1['VdruU'](resolve);
                 }
             } else {
                 $['log']('\n🎁寻宝：宝藏冷却中，请等待冷却完毕');
             }
         }
     } else {
         if (_0x23c5a1['wvLYl'] === _0x23c5a1['wvLYl']) {
             $['log']('\n🎁寻宝：寻宝次数不足');
         } else {
             str = msg + prizeInfo ? ' 获得财富值 ¥ ' + JSON['parse'](prizeInfo)['ddwMoney'] : '';
         }
     }
 }

 function doTreasureHunt(_0x4f110f) {
     var _0x53e433 = {
         'IKfeA': 'success',
         'DTmFS': function(_0x2701f6, _0x411e59) {
             return _0x2701f6 !== _0x411e59;
         },
         'Xhnoh': 'WOVro',
         'HaYLw': function(_0x2374e0, _0x3ff9dc) {
             return _0x2374e0 === _0x3ff9dc;
         },
         'aFEVl': 'BDTKG',
         'aTyHD': function(_0x3afe41, _0x56a9ed) {
             return _0x3afe41(_0x56a9ed);
         },
         'RMYqR': function(_0x5c6d7b) {
             return _0x5c6d7b();
         },
         'kfJnW': function(_0x94bf7e, _0x32bd6e, _0x4c8c70) {
             return _0x94bf7e(_0x32bd6e, _0x4c8c70);
         }
     };
     return new Promise(async _0x5ee705 => {
         var _0x340f78 = {
             'fiWMq': function(_0x2128a8) {
                 return _0x2128a8();
             }
         };
         $['get'](_0x53e433['kfJnW'](taskUrl, 'consume/TreasureHunt', 'strIndex=' + _0x4f110f + '&dwIsShare=0'), async (_0x4c958f, _0x19d8bb, _0x2a7881) => {
             var _0xc68817 = {
                 'YNKvX': function(_0x5ac32e, _0x41742f) {
                     return _0x5ac32e == _0x41742f;
                 },
                 'RgFNt': _0x53e433['IKfeA'],
                 'Sqzln': function(_0x4e4043, _0x19edcd) {
                     return _0x4e4043 || _0x19edcd;
                 }
             };
             try {
                 if (_0x53e433['DTmFS']('YIMLZ', _0x53e433['Xhnoh'])) {
                     if (_0x4c958f) {
                         if (_0x53e433['HaYLw']('fUwJi', _0x53e433['aFEVl'])) {
                             _0x340f78['fiWMq'](_0x5ee705);
                         } else {
                             console['log']('' + JSON['stringify'](_0x4c958f));
                             console['log']($['name'] + ' TreasureHunt API请求失败，请检查网路重试');
                         }
                     } else {
                         const {
                             iRet,
                             dwExpericnce,
                             sErrMsg
                         } = JSON['parse'](_0x2a7881);
                         $['log']('\x0a【' + _0x4f110f + '】🎁寻宝：' + sErrMsg + ' ，获取随机奖励：¥ ' + (dwExpericnce || 0x0) + ' \x0a' + ($['showLog'] ? _0x2a7881 : ''));
                         _0x53e433['aTyHD'](_0x5ee705, iRet);
                     }
                 } else {
                     const {
                         dwMoney,
                         iRet,
                         sErrMsg,
                         strPin
                     } = JSON['parse'](_0x2a7881);
                     $['log']('\x0a【' + sceneList[_key]['strSceneName'] + '】👬好友: ' + (_0xc68817['YNKvX'](sErrMsg, _0xc68817['RgFNt']) ? '获取普通助力财富值：¥ ' + _0xc68817['Sqzln'](dwMoney, 0x0) : sErrMsg) + ' \x0a' + ($['showLog'] ? _0x2a7881 : ''));
                 }
             } catch (_0x4676eb) {
                 $['logErr'](_0x4676eb, _0x19d8bb);
             } finally {
                 _0x53e433['RMYqR'](_0x5ee705);
             }
         });
     });
 }

 function getTaskList(_0x8bda58) {
     var _0x314162 = {
         'oSlbv': function(_0x1290bd) {
             return _0x1290bd();
         },
         'mqZHG': function(_0x4f2b3a, _0x303699) {
             return _0x4f2b3a === _0x303699;
         },
         'tZCbn': 'Jmywl',
         'hdEPj': 'CjiTX',
         'ZeWeZ': 'SXQbD',
         'asqAE': 'mPMzF',
         'KksUk': 'GetUserTaskStatusList',
         'qhxNi': function(_0x124c32, _0x249646) {
             return _0x124c32(_0x249646);
         },
         'cFSak': 'consume/AchieveInfo'
     };
     return new Promise(async _0x2479c0 => {
         var _0x3d97ba = {
             'LVFtD': function(_0x18a6ff) {
                 return _0x314162['oSlbv'](_0x18a6ff);
             },
             'UCIAF': function(_0x45796d, _0x28fba8) {
                 return _0x314162['mqZHG'](_0x45796d, _0x28fba8);
             },
             'sZije': _0x314162['tZCbn'],
             'QZsZI': function(_0x55c0d2, _0x49a31f) {
                 return _0x314162['mqZHG'](_0x55c0d2, _0x49a31f);
             },
             'SHInU': _0x314162['hdEPj'],
             'HAWiw': 'gpiNl',
             'QzOne': _0x314162['ZeWeZ'],
             'ijLHb': function(_0x92db75, _0x13d14c) {
                 return _0x92db75 === _0x13d14c;
             },
             'Rbutt': 'DIvbR',
             'zQVpQ': _0x314162['asqAE']
         };
         switch (_0x8bda58) {
             case 0x0:
                 $['get'](taskListUrl(_0x314162['KksUk']), async (_0x20a7b0, _0x2749d1, _0x47cccb) => {
                     var _0x342759 = {
                         'EJGDO': function(_0x666caa) {
                             return _0x3d97ba['LVFtD'](_0x666caa);
                         }
                     };
                     try {
                         if (_0x20a7b0) {
                             if (_0x3d97ba['UCIAF'](_0x3d97ba['sZije'], _0x3d97ba['sZije'])) {
                                 console['log']('' + JSON['stringify'](_0x20a7b0));
                                 console['log']($['name'] + ' GetUserTaskStatusList API请求失败，请检查网路重试');
                             } else {
                                 _0x342759['EJGDO'](_0x2479c0);
                             }
                         } else {
                             if (_0x3d97ba['QZsZI'](_0x3d97ba['SHInU'], _0x3d97ba['SHInU'])) {
                                 const {
                                     ret,
                                     data: {
                                         userTaskStatusList = []
                                     } = {},
                                     msg
                                 } = JSON['parse'](_0x47cccb);
                                 $['allTask'] = userTaskStatusList['filter'](_0x4ccdcf => _0x4ccdcf['awardStatus'] !== 0x1);
                                 $['log']('\n获取【📆日常任务】列表 ' + msg + '，总共' + $['allTask']['length'] + '个任务！\n' + ($['showLog'] ? _0x47cccb : ''));
                             } else {
                                 _0x2479c0(![]);
                                 $['log']('\x0a' + taskName + '【做日常任务】： mission success');
                                 return;
                             }
                         }
                     } catch (_0x128714) {
                         if (_0x3d97ba['HAWiw'] !== _0x3d97ba['QzOne']) {
                             $['logErr'](_0x128714, _0x2749d1);
                         } else {
                             $['logErr'](_0x128714, _0x2749d1);
                         }
                     } finally {
                         _0x3d97ba['LVFtD'](_0x2479c0);
                     }
                 });
                 break;
             case 0x1:
                 $['get'](_0x314162['qhxNi'](taskUrl, _0x314162['cFSak']), async (_0xea9c67, _0x414c23, _0x3d4e17) => {
                     try {
                         if (_0xea9c67) {
                             console['log']('' + JSON['stringify'](_0xea9c67));
                             console['log']($['name'] + ' AchieveInfo API请求失败，请检查网路重试');
                         } else {
                             if (_0x3d97ba['ijLHb'](_0x3d97ba['Rbutt'], _0x3d97ba['zQVpQ'])) {
                                 $['logErr'](e, _0x414c23);
                             } else {
                                 const {
                                     iRet,
                                     sErrMsg,
                                     taskinfo = []
                                 } = JSON['parse'](_0x3d4e17);
                                 $['allTask'] = taskinfo['filter'](_0x3f2cae => _0x3f2cae['dwAwardStatus'] === 0x1);
                                 $['log']('\x0a获取【🎖成就任务】列表 ' + sErrMsg + '，总共' + $['allTask']['length'] + '个任务！\n' + ($['showLog'] ? _0x3d4e17 : ''));
                             }
                         }
                     } catch (_0x459df8) {
                         $['logErr'](_0x459df8, _0x414c23);
                     } finally {
                         _0x3d97ba['LVFtD'](_0x2479c0);
                     }
                 });
                 break;
             default:
                 break;
         }
     });
 }

 function browserTask(_0xa36be4) {
     var _0x2cdc = {
         'opSuJ': function(_0x3e02c5, _0x4e4ed4) {
             return _0x3e02c5 != _0x4e4ed4;
         },
         'yoHKK': '未中奖',
         'MmOkq': function(_0x18061d, _0x12669d) {
             return _0x18061d === _0x12669d;
         },
         'OULpC': 'bhztp',
         'HrQCQ': function(_0x1d0206, _0x2ed0da) {
             return _0x1d0206 + _0x2ed0da;
         },
         'LCZVu': function(_0x59ed46, _0x4bc395) {
             return _0x59ed46 < _0x4bc395;
         },
         'NbiDX': function(_0x22c9f6, _0x34e774) {
             return _0x22c9f6 !== _0x34e774;
         },
         'HNYAy': 'uoPTQ',
         'KErsX': 'wiJvr',
         'nLSEB': function(_0x1523cd, _0x522220) {
             return _0x1523cd(_0x522220);
         },
         'skBtf': function(_0x3b2888, _0x37be18, _0x4c343f) {
             return _0x3b2888(_0x37be18, _0x4c343f);
         },
         'uBPHd': 'hnAFZ',
         'GdARi': function(_0x598cbb, _0xb1c03a) {
             return _0x598cbb + _0xb1c03a;
         },
         'IbaHA': 'XFimD',
         'nDmgv': function(_0x4a7816, _0x165586, _0x5d1192) {
             return _0x4a7816(_0x165586, _0x5d1192);
         },
         'uSVYK': function(_0x1cc33e, _0xdaf19c) {
             return _0x1cc33e + _0xdaf19c;
         }
     };
     return new Promise(async _0x59bec0 => {
         if (_0x2cdc['MmOkq'](_0x2cdc['OULpC'], _0x2cdc['OULpC'])) {
             switch (_0xa36be4) {
                 case 0x0:
                     const _0x1bde60 = Math['max'](...[...$['allTask']]['map'](_0x36a446 => _0x36a446['configTargetTimes']));
                     for (let _0x37eda6 = 0x0; _0x37eda6 < $['allTask']['length']; _0x37eda6++) {
                         const _0x59ecae = $['allTask'][_0x37eda6];
                         $['log']('\n开始第' + _0x2cdc['HrQCQ'](_0x37eda6, 0x1) + '个【📆日常任务】：' + _0x59ecae['taskName']);
                         const _0x349651 = [!![], !![]];
                         for (let _0x37eda6 = 0x0; _0x2cdc['LCZVu'](_0x37eda6, _0x1bde60); _0x37eda6++) {
                             if (_0x2cdc['NbiDX'](_0x2cdc['HNYAy'], _0x2cdc['HNYAy'])) {
                                 shareCodes = process['env']['JDCFD_SHARECODES']['split']('&');
                             } else {
                                 await $['wait'](0x1f4);
                                 if (_0x349651[0x0]) {
                                     if ('bTTiF' === _0x2cdc['KErsX']) {
                                         $['logErr'](e, resp);
                                     } else {
                                         _0x349651[0x0] = await _0x2cdc['nLSEB'](doTask, _0x59ecae);
                                     }
                                 }
                                 await $['wait'](0x1f4);
                                 if (_0x349651[0x1]) {
                                     _0x349651[0x1] = await _0x2cdc['skBtf'](awardTask, 0x0, _0x59ecae);
                                 }
                                 if (!_0x349651[0x0] && !_0x349651[0x1]) {
                                     if (_0x2cdc['NbiDX']('pVmfM', _0x2cdc['uBPHd'])) {
                                         break;
                                     } else {
                                         $['shareCodesArr']['push'](shareCodes[item]);
                                     }
                                 }
                             }
                         }
                         $['log']('\n结束第' + _0x2cdc['HrQCQ'](_0x37eda6, 0x1) + '个【📆日常任务】：' + _0x59ecae['taskName'] + '\x0a');
                     }
                     break;
                 case 0x1:
                     for (let _0x416fb4 = 0x0; _0x416fb4 < $['allTask']['length']; _0x416fb4++) {
                         const _0x59ecae = $['allTask'][_0x416fb4];
                         $['log']('\n开始第' + _0x2cdc['GdARi'](_0x416fb4, 0x1) + '个【🎖成就任务】：' + _0x59ecae['strTaskDescr']);
                         if (_0x59ecae['dwAwardStatus'] === '0') {
                             if (_0x2cdc['MmOkq']('WgAyB', 'WgAyB')) {
                                 $['log']('\x0a' + _0x59ecae['strTaskDescr'] + '【领成就奖励】：该成就任务未达到门槛}');
                             } else {
                                 if (err) {
                                     console['log']('' + JSON['stringify'](err));
                                     console['log']($['name'] + ' activeScene API请求失败，请检查网路重试');
                                 } else {
                                     console['log']('开通场景结果:' + data + '\x0a');
                                 }
                             }
                         } else {
                             if (_0x2cdc['IbaHA'] !== 'XFimD') {
                                 console['log']('' + JSON['stringify'](err));
                                 console['log']($['name'] + ' QueryUserInfo API请求失败，请检查网路重试');
                             } else {
                                 await $['wait'](0x1f4);
                                 await _0x2cdc['nDmgv'](awardTask, 0x1, _0x59ecae);
                             }
                         }
                         $['log']('\n结束第' + _0x2cdc['uSVYK'](_0x416fb4, 0x1) + '个【🎖成就任务】：' + _0x59ecae['strTaskDescr'] + '\x0a');
                     }
                     break;
                 default:
                     break;
             }
             _0x59bec0();
         } else {
             const {
                 iRet,
                 sErrMsg,
                 strAwardPoolName
             } = JSON['parse'](data);
             $['log']('\x0a【抽奖结果】🎰 ' + (_0x2cdc['opSuJ'](strAwardPoolName, '') ? _0x2cdc['yoHKK'] : strAwardPoolName) + ' \x0a' + ($['showLog'] ? data : ''));
         }
     });
 }

 function doTask(_0xbb2bb2) {
     var _0x5b7847 = {
         'JEEIr': function(_0x4cbfa5, _0x4a1301) {
             return _0x4cbfa5 !== _0x4a1301;
         },
         'pQIvq': '活动太火爆了',
         'Iudwf': function(_0x56d7d8) {
             return _0x56d7d8();
         },
         'EdNti': 'YnaZW',
         'zkvNO': function(_0xeb995a, _0x41c385) {
             return _0xeb995a >= _0x41c385;
         },
         'eLhMQ': function(_0xa1f632, _0xd8c3d9) {
             return _0xa1f632(_0xd8c3d9);
         },
         'NMlDp': function(_0x3643cf, _0x2c953c) {
             return _0x3643cf(_0x2c953c);
         }
     };
     return new Promise(async _0x2c8b9e => {
         if (_0x5b7847['JEEIr'](_0x5b7847['EdNti'], 'AyxtF')) {
             const {
                 taskId,
                 completedTimes,
                 configTargetTimes,
                 taskName
             } = _0xbb2bb2;
             if (_0x5b7847['zkvNO'](_0x5b7847['eLhMQ'](parseInt, completedTimes), parseInt(configTargetTimes))) {
                 _0x5b7847['NMlDp'](_0x2c8b9e, ![]);
                 $['log']('\x0a' + taskName + '【做日常任务】： mission success');
                 return;
             }
             $['get'](taskListUrl('DoTask', 'taskId=' + taskId), (_0xf581a9, _0x469b8a, _0x172982) => {
                 try {
                     if (_0xf581a9) {
                         console['log']('' + JSON['stringify'](_0xf581a9));
                         console['log']($['name'] + ' DoTask API请求失败，请检查网路重试');
                     } else {
                         if (_0x5b7847['JEEIr']('SPjgR', 'JoqXu')) {
                             const {
                                 msg,
                                 ret
                             } = JSON['parse'](_0x172982);
                             $['log']('\x0a' + taskName + '【做日常任务】：' + (_0x5b7847['JEEIr'](msg['indexOf'](_0x5b7847['pQIvq']), -0x1) ? '任务进行中或者未到任务时间' : msg) + '\x0a' + ($['showLog'] ? _0x172982 : ''));
                             _0x2c8b9e(ret === 0x0);
                         } else {
                             $['msg']($['name'], '', '' + $['result']['join']('\x0a'));
                         }
                     }
                 } catch (_0x3a8544) {
                     $['logErr'](_0x3a8544, _0x469b8a);
                 } finally {
                     _0x5b7847['Iudwf'](_0x2c8b9e);
                 }
             });
         } else {
             $['logErr'](e, resp);
         }
     });
 }

 function awardTask(_0x23866f, _0x5e26ae) {
     var _0x2654a7 = {
         'txDFs': function(_0x46af7b, _0x3a707c) {
             return _0x46af7b(_0x3a707c);
         },
         'lKSoy': function(_0x4e863a, _0x17dbf9) {
             return _0x4e863a * _0x17dbf9;
         },
         'gDcfb': 'iILBK',
         'vzoDd': function(_0x4123b7, _0x562af1) {
             return _0x4123b7 !== _0x562af1;
         },
         'ojSlx': '活动太火爆了',
         'EKjOl': '任务为成就任务或者未到任务时间',
         'XiSln': function(_0x31a050, _0x46d5dd) {
             return _0x31a050 === _0x46d5dd;
         },
         'hQvEK': 'bHxLA',
         'MSpcN': 'pYmXX',
         'GqbDX': function(_0x2a108f, _0x55bb39) {
             return _0x2a108f === _0x55bb39;
         },
         'aasmJ': 'QpeHs',
         'HNRJz': function(_0x53d967, _0x5376dc) {
             return _0x53d967 !== _0x5376dc;
         },
         'QxEUh': 'RRDKO',
         'RjaHu': function(_0x5d0261) {
             return _0x5d0261();
         },
         'XqBWc': function(_0x323134, _0x23c40e) {
             return _0x323134 === _0x23c40e;
         },
         'OwsWt': 'AMWTf',
         'gSiGa': 'vBdBi',
         'EvAMD': function(_0x32cb02, _0x2c9c25, _0x3034cf) {
             return _0x32cb02(_0x2c9c25, _0x3034cf);
         }
     };
     return new Promise(_0x512fbd => {
         var _0x2112af = {
             'eURLh': function(_0x2d92ae, _0xe0acc0) {
                 return _0x2654a7['txDFs'](_0x2d92ae, _0xe0acc0);
             },
             'eWvGb': function(_0xcd2b86, _0x3d43ed) {
                 return _0x2654a7['lKSoy'](_0xcd2b86, _0x3d43ed);
             },
             'YukKp': function(_0x5662d1, _0x4f9e16) {
                 return _0x5662d1 + _0x4f9e16;
             }
         };
         if (_0x2654a7['XqBWc'](_0x2654a7['OwsWt'], _0x2654a7['gSiGa'])) {
             str += _sym[_0x2654a7['txDFs'](parseInt, _0x2654a7['lKSoy'](Math['random'](), _sym['length']))];
         } else {
             switch (_0x23866f) {
                 case 0x0:
                     const {
                         taskId, taskName
                     } = _0x5e26ae;
                     $['get'](_0x2654a7['EvAMD'](taskListUrl, 'Award', 'taskId=' + taskId), (_0x19c111, _0x2ba27e, _0x4dd332) => {
                         try {
                             if (_0x19c111) {
                                 if ('iILBK' !== _0x2654a7['gDcfb']) {
                                     const {
                                         sErrMsg
                                     } = JSON['parse'](_0x4dd332);
                                     $['log']('\n【🏝寻宝大作战】' + sErrMsg + '\x0a' + ($['showLog'] ? _0x4dd332 : ''));
                                     _0x2112af['eURLh'](_0x512fbd, 0x0);
                                 } else {
                                     console['log']('' + JSON['stringify'](_0x19c111));
                                     console['log']($['name'] + ' Award API请求失败，请检查网路重试');
                                 }
                             } else {
                                 const {
                                     msg,
                                     ret,
                                     data: {
                                         prizeInfo = ''
                                     } = {}
                                 } = JSON['parse'](_0x4dd332);
                                 let _0x19f332 = '';
                                 if (_0x2654a7['vzoDd'](msg['indexOf'](_0x2654a7['ojSlx']), -0x1)) {
                                     _0x19f332 = _0x2654a7['EKjOl'];
                                 } else {
                                     _0x19f332 = msg + prizeInfo ? ' 获得财富值 ¥ ' + JSON['parse'](prizeInfo)['ddwMoney'] : '';
                                 }
                                 $['log']('\x0a' + taskName + '【领日常奖励】：' + _0x19f332 + '\x0a' + ($['showLog'] ? _0x4dd332 : ''));
                                 _0x2654a7['txDFs'](_0x512fbd, _0x2654a7['XiSln'](ret, 0x0));
                             }
                         } catch (_0x2d6138) {
                             if (_0x2654a7['hQvEK'] === _0x2654a7['MSpcN']) {
                                 index = Math['floor'](_0x2112af['eWvGb'](_0x2112af['YukKp'](i, 0x1), Math['random']()));
                                 temp = shuffled[index];
                                 shuffled[index] = shuffled[i];
                                 shuffled[i] = temp;
                             } else {
                                 $['logErr'](_0x2d6138, _0x2ba27e);
                             }
                         } finally {
                             if (_0x2654a7['GqbDX'](_0x2654a7['aasmJ'], 'QpeHs')) {
                                 _0x512fbd();
                             } else {
                                 if (shareCodes[item]) {
                                     $['shareCodesArr']['push'](shareCodes[item]);
                                 }
                             }
                         }
                     });
                     break;
                 case 0x1:
                     const {
                         strTaskIndex, strTaskDescr
                     } = _0x5e26ae;
                     $['get'](taskUrl('consume/AchieveAward', 'strTaskIndex=' + strTaskIndex), (_0x419d24, _0x1cf4c4, _0x5117b2) => {
                         try {
                             if (_0x419d24) {
                                 console['log']('' + JSON['stringify'](_0x419d24));
                                 console['log']($['name'] + ' AchieveAward API请求失败，请检查网路重试');
                             } else {
                                 const {
                                     iRet,
                                     sErrMsg,
                                     dwExpericnce
                                 } = JSON['parse'](_0x5117b2);
                                 $['log']('\x0a' + strTaskDescr + '【领成就奖励】： success 获得财富值：¥ ' + dwExpericnce + '\x0a' + ($['showLog'] ? _0x5117b2 : ''));
                             }
                         } catch (_0x428c99) {
                             $['logErr'](_0x428c99, _0x1cf4c4);
                         } finally {
                             if (_0x2654a7['HNRJz'](_0x2654a7['QxEUh'], _0x2654a7['QxEUh'])) {
                                 if (_0x419d24) {
                                     console['log']('' + JSON['stringify'](_0x419d24));
                                     console['log']($['name'] + ' AchieveAward API请求失败，请检查网路重试');
                                 } else {
                                     const {
                                         iRet,
                                         sErrMsg,
                                         dwExpericnce
                                     } = JSON['parse'](_0x5117b2);
                                     $['log']('\x0a' + strTaskDescr + '【领成就奖励】： success 获得财富值：¥ ' + dwExpericnce + '\x0a' + ($['showLog'] ? _0x5117b2 : ''));
                                 }
                             } else {
                                 _0x2654a7['RjaHu'](_0x512fbd);
                             }
                         }
                     });
                     break;
                 default:
                     break;
             }
         }
     });
 }

 function funCenterState() {
     var _0x17a40e = {
         'NQnKd': function(_0x464def, _0x2d5b97) {
             return _0x464def(_0x2d5b97);
         },
         'VIUTy': 'gpmiW',
         'gVdkG': function(_0xf2bd72, _0x4f0c37) {
             return _0xf2bd72 == _0x4f0c37;
         },
         'vbVkY': '任务为成就任务或者未到任务时间',
         'YAtCR': 'rBAKV',
         'FoHyd': function(_0x2a0d3d, _0x11c94c, _0x408516) {
             return _0x2a0d3d(_0x11c94c, _0x408516);
         }
     };
     return new Promise(_0x55d5da => {
         var _0x51e74b = {
             'DgRgA': function(_0x637d5c, _0x5906c0) {
                 return _0x17a40e['NQnKd'](_0x637d5c, _0x5906c0);
             },
             'CngYj': function(_0x445f98) {
                 return _0x445f98();
             },
             'prpfl': _0x17a40e['VIUTy'],
             'KBEYF': function(_0x8946d9, _0x239f37) {
                 return _0x17a40e['gVdkG'](_0x8946d9, _0x239f37);
             },
             'gifgy': function(_0xa4518c, _0x5b8670, _0x2ed305, _0x5726c0) {
                 return _0xa4518c(_0x5b8670, _0x2ed305, _0x5726c0);
             },
             'WQvzq': 'KREDN',
             'HYkyY': _0x17a40e['vbVkY']
         };
         if (_0x17a40e['YAtCR'] === _0x17a40e['YAtCR']) {
             $['get'](_0x17a40e['FoHyd'](taskUrl, 'consume/FunCenterState', 'strType=1'), async (_0x3ba71f, _0x2d4fd2, _0x2f84e5) => {
                 var _0x1124f2 = {
                     'KDQui': function(_0x1a6a5e) {
                         return _0x1a6a5e();
                     },
                     'YbtPk': function(_0x3ea6e4, _0x302fc3) {
                         return _0x51e74b['DgRgA'](_0x3ea6e4, _0x302fc3);
                     },
                     'LjJJN': function(_0x4b3811) {
                         return _0x51e74b['CngYj'](_0x4b3811);
                     }
                 };
                 try {
                     if (_0x51e74b['prpfl'] === _0x51e74b['prpfl']) {
                         if (_0x3ba71f) {
                             console['log']('' + JSON['stringify'](_0x3ba71f));
                             console['log']($['name'] + ' FunCenterState API请求失败，请检查网路重试');
                         } else {
                             const {
                                 SlotMachine: {
                                     ddwConfVersion,
                                     dwFreeCount,
                                     strCouponPool,
                                     strGoodsPool
                                 } = {},
                                 iRet,
                                 sErrMsg
                             } = JSON['parse'](_0x2f84e5);
                             if (_0x51e74b['KBEYF'](dwFreeCount, 0x1)) {
                                 await $['wait'](0x1f4);
                                 await _0x51e74b['gifgy'](soltMachine, strCouponPool, strGoodsPool, ddwConfVersion);
                             }
                         }
                     } else {
                         _0x1124f2['KDQui'](_0x55d5da);
                     }
                 } catch (_0x238927) {
                     if (_0x51e74b['WQvzq'] === _0x51e74b['WQvzq']) {
                         $['logErr'](_0x238927, _0x2d4fd2);
                     } else {
                         try {
                             _0x1124f2['YbtPk'](_0x55d5da, JSON['parse'](_0x2f84e5));
                         } catch (_0x4db2e1) {} finally {
                             _0x1124f2['LjJJN'](_0x55d5da);
                         }
                     }
                 } finally {
                     _0x55d5da();
                 }
             });
         } else {
             str = _0x51e74b['HYkyY'];
         }
     });
 }

 function soltMachine(_0x25d797, _0x5996c0, _0x215e0e) {
     var _0x41b298 = {
         'xyiFv': 'uNPUg',
         'soZfy': function(_0x114ca2, _0x2183c2) {
             return _0x114ca2 != _0x2183c2;
         }
     };
     return new Promise(_0x3455eb => {
         var _0x5c421d = {
             'Vvslo': _0x41b298['xyiFv'],
             'NUtYc': function(_0x33ccb9, _0x34d67e) {
                 return _0x41b298['soZfy'](_0x33ccb9, _0x34d67e);
             },
             'eCDQF': function(_0x4ae869) {
                 return _0x4ae869();
             }
         };
         $['get'](taskUrl('consume/SlotMachine', 'strCouponPool=' + _0x25d797 + '&strGoodsPool=' + _0x5996c0 + '&ddwConfVersion=' + _0x215e0e), async (_0x1468af, _0x583d8e, _0x441be3) => {
             try {
                 if (_0x5c421d['Vvslo'] === 'zjUQr') {
                     console['log']('' + JSON['stringify'](_0x1468af));
                     console['log']($['name'] + ' createAssistUser JoinScene API请求失败，请检查网路重试');
                 } else {
                     if (_0x1468af) {
                         console['log']('' + JSON['stringify'](_0x1468af));
                         console['log']($['name'] + ' SlotMachine API请求失败，请检查网路重试');
                     } else {
                         const {
                             iRet,
                             sErrMsg,
                             strAwardPoolName
                         } = JSON['parse'](_0x441be3);
                         $['log']('\x0a【抽奖结果】🎰 ' + (_0x5c421d['NUtYc'](strAwardPoolName, '') ? '未中奖' : strAwardPoolName) + ' \x0a' + ($['showLog'] ? _0x441be3 : ''));
                     }
                 }
             } catch (_0x131b63) {
                 $['logErr'](_0x131b63, _0x583d8e);
             } finally {
                 _0x5c421d['eCDQF'](_0x3455eb);
             }
         });
     });
 }

 function createAssistUser(_0x54771f) {
     var _0x43603e = {
         'DLiMZ': function(_0x203a25, _0x5c48c3) {
             return _0x203a25 !== _0x5c48c3;
         },
         'nWsCj': 'qcMNy',
         'XvbSX': function(_0x4ebcb9, _0x47d4d0) {
             return _0x4ebcb9 === _0x47d4d0;
         },
         'jANlS': function(_0x5d6408, _0x447990) {
             return _0x5d6408 === _0x447990;
         },
         'DSKQg': function(_0x46fb76) {
             return _0x46fb76();
         },
         'QULbj': function(_0x1150ec, _0xda438c) {
             return _0x1150ec(_0xda438c);
         }
     };
     return new Promise(_0x3794b9 => {
         $['get'](taskUrl('user/JoinScene', 'strShareId=' + _0x43603e['QULbj'](escape, _0x54771f) + '&dwSceneId=1001'), async (_0x396aa1, _0xf4356f, _0xd9a2b1) => {
             try {
                 if (_0x43603e['DLiMZ'](_0x43603e['nWsCj'], _0x43603e['nWsCj'])) {
                     Object['keys'](shareCodes)['forEach'](_0x555d2c => {
                         if (shareCodes[_0x555d2c]) {
                             $['shareCodesArr']['push'](shareCodes[_0x555d2c]);
                         }
                     });
                 } else {
                     if (_0x396aa1) {
                         console['log']('' + JSON['stringify'](_0x396aa1));
                         console['log']($['name'] + ' createAssistUser JoinScene API请求失败，请检查网路重试');
                     } else {
                         console['log']('普通助力(招工)结果:' + _0xd9a2b1);
                         const {
                             iRet
                         } = JSON['parse'](_0xd9a2b1);
                         if (_0x43603e['XvbSX'](iRet, 0x7d5) || _0x43603e['jANlS'](iRet, 0x270f)) $['canHelp'] = ![];
                     }
                 }
             } catch (_0x26e32a) {} finally {
                 _0x43603e['DSKQg'](_0x3794b9);
             }
         });
     });
 }

 function createSuperAssistUser(_0x4a6fa6) {
     var _0x183ab9 = {
         'tDWUd': function(_0x5852f0, _0x1c12ce) {
             return _0x5852f0 === _0x1c12ce;
         },
         'Thshz': function(_0x45fd19) {
             return _0x45fd19();
         },
         'gmRYI': function(_0x2f7102, _0x5dd9b2, _0x40cd68) {
             return _0x2f7102(_0x5dd9b2, _0x40cd68);
         },
         'hZApP': 'user/JoinScene',
         'VsNSG': 'timestamp',
         'kjvFz': function(_0x4a5aa4, _0x3dc5ef) {
             return _0x4a5aa4(_0x3dc5ef);
         }
     };
     return new Promise(_0x286c98 => {
         var _0x768f60 = {
             'wHaXZ': function(_0x3f4078, _0x57f4cb) {
                 return _0x183ab9['tDWUd'](_0x3f4078, _0x57f4cb);
             },
             'zUdMq': function(_0xf70586) {
                 return _0x183ab9['Thshz'](_0xf70586);
             }
         };
         $['get'](_0x183ab9['gmRYI'](taskUrl, _0x183ab9['hZApP'], 'strPgtimestamp=' + token[_0x183ab9['VsNSG']] + '&strPhoneID=' + token['phoneid'] + '&strPgUUNum=' + token['farm_jstoken'] + '&strShareId=' + _0x183ab9['kjvFz'](escape, _0x4a6fa6) + '&dwSceneId=1001&dwType=2'), async (_0x48cf18, _0x3e2c23, _0x265645) => {
             try {
                 if (_0x48cf18) {
                     console['log']('' + JSON['stringify'](_0x48cf18));
                     console['log']($['name'] + ' createSuperAssistUser JoinScene API请求失败，请检查网路重试');
                 } else {
                     console['log']('超级助力(超级工人)结果:' + _0x265645);
                     const {
                         sErrMsg,
                         iRet
                     } = JSON['parse'](_0x265645);
                     if (iRet === 0x7d5 || _0x768f60['wHaXZ'](iRet, 0x270f)) $['canHelp'] = ![];
                 }
             } catch (_0x246ea8) {
                 $['logErr'](_0x246ea8, _0x3e2c23);
             } finally {
                 _0x768f60['zUdMq'](_0x286c98);
             }
         });
     });
 }

 function joinGroup(_0xdba0a1) {
     var _0x3cd351 = {
         'vZlKE': function(_0x5f01b2) {
             return _0x5f01b2();
         },
         'obdhx': function(_0x5429f4, _0x58bb2a) {
             return _0x5429f4 === _0x58bb2a;
         },
         'pAHEZ': function(_0x29386c, _0x15e017) {
             return _0x29386c === _0x15e017;
         },
         'diuOB': 'vxMAQ',
         'eVFJX': 'farm_jstoken'
     };
     return new Promise(async _0x39da7c => {
         var _0x177dcb = {
             'yfJrh': function(_0x42d2e9) {
                 return _0x3cd351['vZlKE'](_0x42d2e9);
             },
             'mRrzY': function(_0x1d9756, _0xd3daf5) {
                 return _0x1d9756 === _0xd3daf5;
             },
             'POtcT': function(_0x5372fb, _0x2e0bf5) {
                 return _0x3cd351['obdhx'](_0x5372fb, _0x2e0bf5);
             },
             'XRqnw': function(_0x9c3788, _0x286a67) {
                 return _0x9c3788 !== _0x286a67;
             }
         };
         if (_0x3cd351['pAHEZ'](_0x3cd351['diuOB'], _0x3cd351['diuOB'])) {
             $['get'](taskUrl('user/JoinGroup', 'strGroupId=' + _0xdba0a1 + '&dwIsNewUser=0&pgtimestamp=' + token['timestamp'] + '&phoneID=' + token['phoneid'] + '&pgUUNum=' + token[_0x3cd351['eVFJX']]), (_0xab9a89, _0x5a2bc9, _0x4e642b) => {
                 try {
                     if (_0xab9a89) {
                         console['log']('' + JSON['stringify'](_0xab9a89));
                         console['log']($['name'] + ' joinGroup API请求失败，请检查网路重试');
                     } else {
                         const {
                             sErrMsg,
                             iRet
                         } = _0x4e642b = JSON['parse'](_0x4e642b);
                         if (_0x177dcb['mRrzY'](iRet, 0x7d5) || _0x177dcb['POtcT'](iRet, 0x270f)) $['canHelp'] = ![];
                         $['log']('iRet:' + iRet + ' ' + sErrMsg);
                     }
                 } catch (_0x2a5815) {
                     if (_0x177dcb['XRqnw']('iOOcG', 'VpuDB')) {
                         $['logErr'](_0x2a5815, _0x5a2bc9);
                     } else {
                         _0x177dcb['yfJrh'](_0x39da7c);
                     }
                 } finally {
                     _0x39da7c(_0x4e642b || {});
                 }
             });
         } else {
             _0x177dcb['yfJrh'](_0x39da7c);
         }
     });
 }

 function submitGroupId() {
     var _0x399749 = {
         'MWevk': '(每天都变化,旧的不可用)\x0a\x0a',
         'FCYtP': function(_0x3a4a65, _0x439088) {
             return _0x3a4a65 == _0x439088;
         },
         'bMJWZ': 'vvDER',
         'oVjSj': function(_0x4f9e2e) {
             return _0x4f9e2e();
         },
         'osDwi': function(_0x401f23, _0x241318) {
             return _0x401f23 === _0x241318;
         },
         'hFgKB': 'qWVMD',
         'zDBZv': 'JiNTD',
         'JbtgT': function(_0x5921c2, _0x15487c) {
             return _0x5921c2 + _0x15487c;
         }
     };
     return new Promise(_0x1858f3 => {
         var _0x384540 = {
             'KjPDB': function(_0x1be4b7, _0x151b42) {
                 return _0x1be4b7 + _0x151b42;
             },
             'FTvqq': _0x399749['MWevk'],
             'ApglL': function(_0x5e286f, _0x164d81) {
                 return _0x399749['FCYtP'](_0x5e286f, _0x164d81);
             },
             'eOAnZ': function(_0x2c79ea, _0x2b3d48) {
                 return _0x2c79ea || _0x2b3d48;
             },
             'PfOab': function(_0x4da926, _0x4a093d) {
                 return _0x4da926 !== _0x4a093d;
             },
             'GPkeG': _0x399749['bMJWZ'],
             'sGcGQ': function(_0x1f8fd3) {
                 return _0x399749['oVjSj'](_0x1f8fd3);
             },
             'jBbYJ': function(_0x15cf1b, _0x29a5ea) {
                 return _0x15cf1b === _0x29a5ea;
             },
             'ouNZL': function(_0x2071a3, _0x3be7a6) {
                 return _0x399749['osDwi'](_0x2071a3, _0x3be7a6);
             },
             'WLqnP': 'kflhL',
             'leAUC': function(_0x224189) {
                 return _0x399749['oVjSj'](_0x224189);
             },
             'CwwIs': _0x399749['hFgKB'],
             'cZHTY': _0x399749['zDBZv'],
             'QpGso': function(_0x59b944, _0x51a7bb) {
                 return _0x399749['JbtgT'](_0x59b944, _0x51a7bb);
             },
             'KKKib': '\n\n你的【🏝寻宝大作战】互助码: '
         };
         $['get'](taskUrl('user/GatherForture'), async (_0x25ebef, _0xe112f2, _0x46f79e) => {
             var _0x4405eb = {
                 'giowU': function(_0x54c8e8, _0x26be85) {
                     return _0x384540['ApglL'](_0x54c8e8, _0x26be85);
                 },
                 'CollW': 'success',
                 'hKogH': function(_0x57dc42, _0x473e51) {
                     return _0x384540['eOAnZ'](_0x57dc42, _0x473e51);
                 }
             };
             try {
                 if (_0x25ebef) {
                     if (_0x384540['PfOab'](_0x384540['GPkeG'], 'BHgav')) {
                         console['log']('' + JSON['stringify'](_0x25ebef));
                         console['log']($['name'] + ' GatherForture API请求失败，请检查网路重试');
                     } else {
                         if (_0x25ebef) {
                             console['log']('' + JSON['stringify'](_0x25ebef));
                             console['log']($['name'] + ' getMoney_dwSource_2 API请求失败，请检查网路重试');
                         } else {
                             const {
                                 dwMoney,
                                 iRet,
                                 sErrMsg,
                                 strPin
                             } = JSON['parse'](data);
                             $['log']('\x0a【' + sceneList[_key]['strSceneName'] + '】👬好友: ' + (_0x4405eb['giowU'](sErrMsg, _0x4405eb['CollW']) ? '获取普通助力财富值：¥ ' + _0x4405eb['hKogH'](dwMoney, 0x0) : sErrMsg) + ' \x0a' + ($['showLog'] ? data : ''));
                         }
                     }
                 } else {
                     const {
                         GroupInfo: {
                             strGroupId
                         },
                         strPin
                     } = JSON['parse'](_0x46f79e);
                     if (!strGroupId) {
                         const _0x1bbc7c = await _0x384540['sGcGQ'](openGroup);
                         if (_0x384540['jBbYJ'](_0x1bbc7c, 0x0)) {
                             if (_0x384540['ouNZL'](_0x384540['WLqnP'], 'YYfPQ')) {
                                 $['logErr'](e, _0xe112f2);
                             } else {
                                 await _0x384540['leAUC'](submitGroupId);
                             }
                         } else {
                             if (_0x384540['PfOab'](_0x384540['CwwIs'], _0x384540['cZHTY'])) {
                                 _0x384540['leAUC'](_0x1858f3);
                             } else {
                                 $['log'](_0x384540['KjPDB']('\n\n你的【🏝寻宝大作战】互助码: ', strGroupId) + _0x384540['FTvqq']);
                                 $['shareCodes']['push'](strGroupId);
                             }
                         }
                     } else {
                         $['log'](_0x384540['KjPDB'](_0x384540['QpGso'](_0x384540['KKKib'], strGroupId), _0x384540['FTvqq']));
                         $['shareCodes']['push'](strGroupId);
                     }
                 }
             } catch (_0x2c86e8) {
                 if (_0x384540['PfOab']('gTYOW', 'hFSyh')) {
                     $['logErr'](_0x2c86e8, _0xe112f2);
                 } else {
                     $['logErr'](_0x2c86e8, _0xe112f2);
                 }
             } finally {
                 _0x384540['leAUC'](_0x1858f3);
             }
         });
     });
 }

 function openGroup() {
     var _0x130f66 = {
         'DXaxV': function(_0x2d9c8f, _0x436f99) {
             return _0x2d9c8f !== _0x436f99;
         },
         'nCHRh': 'XMkBI',
         'yTwJT': 'tNScX',
         'lcnFe': function(_0x17a9cd, _0x48adc3) {
             return _0x17a9cd(_0x48adc3);
         },
         'AElVB': function(_0x4dcffc) {
             return _0x4dcffc();
         },
         'XBpXu': function(_0x15212, _0xb6ebc2, _0x29a4ad) {
             return _0x15212(_0xb6ebc2, _0x29a4ad);
         }
     };
     return new Promise(async _0x16e3b0 => {
         $['get'](_0x130f66['XBpXu'](taskUrl, 'user/OpenGroup', 'dwIsNewUser=' + $['info']['dwIsNewUser']), async (_0x1bf4ae, _0x4b5a09, _0x50cb56) => {
             try {
                 if (_0x130f66['DXaxV'](_0x130f66['nCHRh'], _0x130f66['nCHRh'])) {
                     if (_0x1bf4ae) {} else {
                         if (_0x50cb56) _0x50cb56 = JSON['parse'](_0x50cb56);
                     }
                 } else {
                     if (_0x1bf4ae) {
                         if (_0x130f66['DXaxV'](_0x130f66['yTwJT'], 'ExyHt')) {
                             console['log']('' + JSON['stringify'](_0x1bf4ae));
                             console['log']($['name'] + ' OpenGroup API请求失败，请检查网路重试');
                         } else {
                             $['logErr'](e, _0x4b5a09);
                         }
                     } else {
                         const {
                             sErrMsg
                         } = JSON['parse'](_0x50cb56);
                         $['log']('\x0a【🏝寻宝大作战】' + sErrMsg + '\x0a' + ($['showLog'] ? _0x50cb56 : ''));
                         _0x130f66['lcnFe'](_0x16e3b0, 0x0);
                     }
                 }
             } catch (_0x584b9c) {
                 $['logErr'](_0x584b9c, _0x4b5a09);
             } finally {
                 _0x130f66['AElVB'](_0x16e3b0);
             }
         });
     });
 }

 function openPeriodBox() {
     var _0x21b4bc = {
         'FcMKp': 'BODgq',
         'DlRsV': 'DAPJA',
         'lGusb': function(_0x314288, _0xd87513) {
             return _0x314288 === _0xd87513;
         },
         'lZtgy': 'oYhEM',
         'rIAxv': 'YERLg',
         'xJlnY': function(_0x88f838) {
             return _0x88f838();
         },
         'trzjV': function(_0x780b33, _0x348234) {
             return _0x780b33(_0x348234);
         },
         'OXQma': function(_0x55c24a, _0x36567e) {
             return _0x55c24a == _0x36567e;
         },
         'rvoLa': 'https://bean.m.jd.com/bean/signIndex.action',
         'hWwhG': function(_0x550075, _0x5e9dc7) {
             return _0x550075 * _0x5e9dc7;
         },
         'SKJiB': 'zh-cn',
         'pgTpd': function(_0xa30898) {
             return _0xa30898();
         },
         'WVRnC': 'qvSvh',
         'ztPPJ': function(_0x5261bf, _0xa40326) {
             return _0x5261bf !== _0xa40326;
         },
         'WfaZW': function(_0x403b65) {
             return _0x403b65();
         }
     };
     return new Promise(async _0x3b06d2 => {
         var _0x5e2132 = {
             'RQZMw': _0x21b4bc['FcMKp'],
             'ZDqax': function(_0x35f7b5, _0x4b3cb8) {
                 return _0x35f7b5 == _0x4b3cb8;
             },
             'Lapoj': 'erNbV',
             'GMhgk': _0x21b4bc['DlRsV'],
             'vvwvl': function(_0x4995a8, _0x59afb7) {
                 return _0x21b4bc['lGusb'](_0x4995a8, _0x59afb7);
             },
             'zLapA': _0x21b4bc['lZtgy'],
             'XXuBq': _0x21b4bc['rIAxv'],
             'FjmbA': function(_0x58cec0) {
                 return _0x21b4bc['xJlnY'](_0x58cec0);
             },
             'joOXD': function(_0x2b2479) {
                 return _0x2b2479();
             },
             'WqaGt': function(_0x180dea, _0x2f004b) {
                 return _0x21b4bc['trzjV'](_0x180dea, _0x2f004b);
             },
             'opHIA': function(_0x13b700, _0x1f69b8) {
                 return _0x21b4bc['OXQma'](_0x13b700, _0x1f69b8);
             },
             'MtYEW': function(_0xe631a) {
                 return _0x21b4bc['xJlnY'](_0xe631a);
             },
             'seDjP': _0x21b4bc['rvoLa'],
             'dUYiI': 'keep-alive',
             'SRYkq': function(_0x5c42a9, _0x689abd) {
                 return _0x5c42a9 + _0x689abd;
             },
             'BBCnx': function(_0x1dcb3a, _0xc40860) {
                 return _0x21b4bc['hWwhG'](_0x1dcb3a, _0xc40860);
             },
             'rUSGN': _0x21b4bc['SKJiB'],
             'UhkhC': 'ReSUO',
             'xzMHo': function(_0x58a5f2, _0x215a9b) {
                 return _0x58a5f2 < _0x215a9b;
             },
             'LxIZw': function(_0x2b69a7, _0x303014) {
                 return _0x2b69a7 == _0x303014;
             },
             'LVRgP': function(_0x5a6ed5, _0x19c72f, _0x25bc88) {
                 return _0x5a6ed5(_0x19c72f, _0x25bc88);
             },
             'Fznvy': function(_0x569021) {
                 return _0x21b4bc['pgTpd'](_0x569021);
             },
             'yUVYK': _0x21b4bc['WVRnC'],
             'jkJbl': 'qlDAP',
             'DklFr': function(_0x45a46c, _0x3bcdb0) {
                 return _0x21b4bc['ztPPJ'](_0x45a46c, _0x3bcdb0);
             },
             'IZAdm': 'HTUZl',
             'PPgJk': function(_0x3d284d) {
                 return _0x21b4bc['WfaZW'](_0x3d284d);
             }
         };
         $['get'](_0x21b4bc['trzjV'](taskUrl, 'user/GatherForture'), async (_0x5de466, _0x4f4434, _0x39f350) => {
             var _0x3eaf85 = {
                 'cuyWr': function(_0x33fcf4, _0x7bc425) {
                     return _0x5e2132['opHIA'](_0x33fcf4, _0x7bc425);
                 },
                 'GZfvh': function(_0x4c9b38) {
                     return _0x5e2132['MtYEW'](_0x4c9b38);
                 },
                 'AGFKw': _0x5e2132['seDjP'],
                 'ltRba': _0x5e2132['dUYiI'],
                 'CeGpY': function(_0x50febf, _0x26a069) {
                     return _0x5e2132['SRYkq'](_0x50febf, _0x26a069);
                 },
                 'jfplK': function(_0xa4bdbe, _0x1db67c) {
                     return _0x5e2132['BBCnx'](_0xa4bdbe, _0x1db67c);
                 },
                 'UioiY': _0x5e2132['rUSGN']
             };
             if ('mTvfE' === 'qrYPL') {
                 try {
                     const {
                         dwMoney,
                         iRet,
                         sErrMsg
                     } = JSON['parse'](_0x39f350);
                     $['log']('\n【🏝寻宝大作战】【' + strBrandName + '】开宝箱：' + (_0x3eaf85['cuyWr'](sErrMsg, 'success') ? ' 获得财富值 ¥ ' + dwMoney : sErrMsg) + '\x0a' + ($['showLog'] ? _0x39f350 : ''));
                 } catch (_0x5aacd9) {
                     $['logErr'](_0x5aacd9, _0x4f4434);
                 } finally {
                     _0x3eaf85['GZfvh'](_0x3b06d2);
                 }
             } else {
                 try {
                     if (_0x5de466) {
                         console['log']('' + JSON['stringify'](_0x5de466));
                         console['log']($['name'] + ' GatherForture API请求失败，请检查网路重试');
                     } else {
                         if (_0x5e2132['vvwvl']('ReSUO', _0x5e2132['UhkhC'])) {
                             const {
                                 PeriodBox = [{}]
                             } = JSON['parse'](_0x39f350);
                             for (var _0x5774b9 = 0x0; _0x5e2132['xzMHo'](_0x5774b9, PeriodBox['length']); _0x5774b9++) {
                                 const {
                                     dwStatus,
                                     dwSeq,
                                     strBrandName
                                 } = PeriodBox[_0x5774b9];
                                 if (_0x5e2132['LxIZw'](dwStatus, 0x2)) {
                                     await $['wait'](0x3e8);
                                     await $['get'](_0x5e2132['LVRgP'](taskUrl, 'user/OpenPeriodBox', 'dwSeq=' + dwSeq), async (_0x5de466, _0x4f4434, _0x39f350) => {
                                         if (_0x5e2132['RQZMw'] === 'PCEsR') {
                                             $['msg']($['name'], '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', _0x3eaf85['AGFKw'], {
                                                 'open-url': _0x3eaf85['AGFKw']
                                             });
                                             return;
                                         } else {
                                             try {
                                                 const {
                                                     dwMoney,
                                                     iRet,
                                                     sErrMsg
                                                 } = JSON['parse'](_0x39f350);
                                                 $['log']('\x0a【🏝寻宝大作战】【' + strBrandName + '】开宝箱：' + (_0x5e2132['ZDqax'](sErrMsg, 'success') ? ' 获得财富值 ¥ ' + dwMoney : sErrMsg) + '\x0a' + ($['showLog'] ? _0x39f350 : ''));
                                             } catch (_0x11ed1e) {
                                                 if (_0x5e2132['Lapoj'] !== _0x5e2132['GMhgk']) {
                                                     $['logErr'](_0x11ed1e, _0x4f4434);
                                                 } else {
                                                     return {
                                                         'url': JD_API_HOST + 'jxcfd/' + function_path + '?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=' + Date['now']() + '&ptag=138631.26.55&' + body + '&_ste=1&_=' + Date['now']() + '&sceneval=2&g_login_type=1&g_ty=ls',
                                                         'headers': {
                                                             'Cookie': cookie,
                                                             'Accept': '*/*',
                                                             'Connection': _0x3eaf85['ltRba'],
                                                             'Referer': 'https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55',
                                                             'Accept-Encoding': 'gzip, deflate, br',
                                                             'Host': 'm.jingxi.com',
                                                             'User-Agent': 'jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/' + _0x3eaf85['CeGpY'](_0x3eaf85['jfplK'](Math['random'], 0x62), 0x1) + ';pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                                                             'Accept-Language': _0x3eaf85['UioiY']
                                                         },
                                                         'timeout': 0x2710
                                                     };
                                                 }
                                             } finally {
                                                 if (_0x5e2132['vvwvl'](_0x5e2132['zLapA'], _0x5e2132['XXuBq'])) {
                                                     $['logErr'](e, _0x4f4434);
                                                 } else {
                                                     _0x5e2132['FjmbA'](_0x3b06d2);
                                                 }
                                             }
                                         }
                                     });
                                 } else if (_0x5e2132['LxIZw'](dwStatus, 0x3)) {
                                     $['log']('\n【🏝寻宝大作战】【' + strBrandName + '】开宝箱：宝箱已开启过！');
                                 } else {
                                     $['log']('\x0a【🏝寻宝大作战】【' + strBrandName + '】开宝箱：未达到宝箱开启条件，快去邀请好友助力吧！');
                                     _0x5e2132['Fznvy'](_0x3b06d2);
                                 }
                             }
                         } else {
                             _0x5e2132['joOXD'](_0x3b06d2);
                         }
                     }
                 } catch (_0x3cccd9) {
                     if (_0x5e2132['yUVYK'] === _0x5e2132['jkJbl']) {
                         shareCodes = process['env']['JDCFD_SHARECODES']['split']('\x0a');
                     } else {
                         $['logErr'](_0x3cccd9, _0x4f4434);
                     }
                 } finally {
                     if (_0x5e2132['DklFr'](_0x5e2132['IZAdm'], 'khJNE')) {
                         _0x5e2132['PPgJk'](_0x3b06d2);
                     } else {
                         if (_0x5de466) {
                             console['log']('' + JSON['stringify'](_0x5de466));
                             console['log']($['name'] + ' OpenGroup API请求失败，请检查网路重试');
                         } else {
                             const {
                                 sErrMsg
                             } = JSON['parse'](_0x39f350);
                             $['log']('\n【🏝寻宝大作战】' + sErrMsg + '\x0a' + ($['showLog'] ? _0x39f350 : ''));
                             _0x5e2132['WqaGt'](_0x3b06d2, 0x0);
                         }
                     }
                 }
             }
         });
     });
 }

 function activeScene(_0x432aa9) {
     var _0x3747f0 = {
         'gdRxe': function(_0x4824f1) {
             return _0x4824f1();
         },
         'HmFNg': function(_0x5c70ab, _0x123f21) {
             return _0x5c70ab !== _0x123f21;
         },
         'kfbnt': 'OoMrW',
         'pacIE': 'biXeS',
         'vfyJp': function(_0x57b3d0, _0x4f3109) {
             return _0x57b3d0 === _0x4f3109;
         },
         'Soxrp': '*/*',
         'wbhTl': 'keep-alive',
         'BQOUV': 'gzip, deflate, br',
         'oGMKP': 'm.jingxi.com',
         'ScaUB': function(_0x576111, _0x155411) {
             return _0x576111 + _0x155411;
         },
         'vmvbq': function(_0x286af1, _0x23e648) {
             return _0x286af1 * _0x23e648;
         },
         'HBEWI': 'zh-cn'
     };
     return new Promise(_0x12fceb => {
         var _0x488000 = {
             'vSRvY': function(_0xed6a62) {
                 return _0x3747f0['gdRxe'](_0xed6a62);
             },
             'hNniv': function(_0x3e8cbe, _0x1daca9) {
                 return _0x3747f0['HmFNg'](_0x3e8cbe, _0x1daca9);
             },
             'OepEg': _0x3747f0['kfbnt'],
             'FNaRv': 'NdBjq',
             'rxtaT': function(_0xae618f, _0x489b41) {
                 return _0x3747f0['HmFNg'](_0xae618f, _0x489b41);
             },
             'ejDDp': _0x3747f0['pacIE'],
             'JkaUG': function(_0x1e3232, _0x3719b7) {
                 return _0x3747f0['vfyJp'](_0x1e3232, _0x3719b7);
             }
         };
         const _0x2764b3 = {
             'url': JD_API_HOST + 'jxcfd/user/ActiveScene?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=' + Date['now']() + '&ptag=&dwSceneId=' + Number(_0x432aa9) + '&_stk=_cfd_t,bizCode,dwEnv,dwSceneId,ptag,source,strZone&_ste=1&h5st=20210304125239873;1540797227618115;10009;tk01we7831daaa8nRzRiUm4rZjRynBiuCHXtzWJmGCtVH2P+YnfnjoIsTWS87p85/fH4kcisjwWpqa10pRs3zMclNzix;5a9afbeb82bbb4e5e62cfe4b72965b5a2bf12cc3c56817b53e93a1cead562dc4&_=' + Date['now']() + '&sceneval=2&g_login_type=1',
             'headers': {
                 'Cookie': cookie,
                 'Accept': _0x3747f0['Soxrp'],
                 'Connection': _0x3747f0['wbhTl'],
                 'Referer': 'https://st.jingxi.com/fortune_island/index.html',
                 'Accept-Encoding': _0x3747f0['BQOUV'],
                 'Host': _0x3747f0['oGMKP'],
                 'User-Agent': 'jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/' + _0x3747f0['ScaUB'](_0x3747f0['vmvbq'](Math['random'], 0x62), 0x1) + ';pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                 'Accept-Language': _0x3747f0['HBEWI']
             }
         };
         $['get'](_0x2764b3, (_0x565a29, _0x1ea1eb, _0x1c8409) => {
             if (_0x488000['hNniv'](_0x488000['OepEg'], _0x488000['OepEg'])) {
                 _0x488000['vSRvY'](_0x12fceb);
             } else {
                 try {
                     if (_0x488000['FNaRv'] === 'NdBjq') {
                         if (_0x565a29) {
                             console['log']('' + JSON['stringify'](_0x565a29));
                             console['log']($['name'] + ' activeScene API请求失败，请检查网路重试');
                         } else {
                             if (_0x488000['rxtaT'](_0x488000['ejDDp'], _0x488000['ejDDp'])) {
                                 $['log']('\n【🏝寻宝大作战】【' + strBrandName + '】开宝箱：宝箱已开启过！');
                             } else {
                                 console['log']('开通场景结果:' + _0x1c8409 + '\x0a');
                             }
                         }
                     } else {
                         $['msg']($['name'], '', '' + $['result']['join']('\x0a'));
                     }
                 } catch (_0x155d50) {
                     if (_0x488000['JkaUG']('WDYPI', 'iTvEf')) {
                         $['logErr'](_0x155d50, _0x1ea1eb);
                     } else {
                         $['logErr'](_0x155d50, _0x1ea1eb);
                     }
                 } finally {
                     _0x12fceb();
                 }
             }
         });
     });
 }

 function taskUrl(_0x1e02f8, _0x20a342) {
     var _0x5e5ba5 = {
         'CFOkO': '*/*',
         'qAOoh': 'keep-alive',
         'bonbV': 'https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55',
         'mZnOn': 'gzip, deflate, br',
         'afhje': 'm.jingxi.com',
         'XEpHd': function(_0x32d5f2, _0x1ca100) {
             return _0x32d5f2 * _0x1ca100;
         },
         'sUFfZ': 'zh-cn'
     };
     return {
         'url': JD_API_HOST + 'jxcfd/' + _0x1e02f8 + '?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=' + Date['now']() + '&ptag=138631.26.55&' + _0x20a342 + '&_ste=1&_=' + Date['now']() + '&sceneval=2&g_login_type=1&g_ty=ls',
         'headers': {
             'Cookie': cookie,
             'Accept': _0x5e5ba5['CFOkO'],
             'Connection': _0x5e5ba5['qAOoh'],
             'Referer': _0x5e5ba5['bonbV'],
             'Accept-Encoding': _0x5e5ba5['mZnOn'],
             'Host': _0x5e5ba5['afhje'],
             'User-Agent': 'jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/' + (_0x5e5ba5['XEpHd'](Math['random'], 0x62) + 0x1) + ';pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
             'Accept-Language': _0x5e5ba5['sUFfZ']
         },
         'timeout': 0x2710
     };
 }

 function taskListUrl(_0x11c481, _0x38782e) {
     var _0x2baabb = {
         'QivTT': 'https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55',
         'XOqnw': 'gzip, deflate, br',
         'SlgTw': 'm.jingxi.com',
         'UFcdX': function(_0x55ca52, _0x3547d9) {
             return _0x55ca52 * _0x3547d9;
         },
         'xJxwL': 'zh-cn'
     };
     return {
         'url': JD_API_HOST + 'newtasksys/newtasksys_front/' + _0x11c481 + '?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=' + Date['now']() + '&ptag=138631.26.55&' + _0x38782e + '&_ste=1&_=' + Date['now']() + '&sceneval=2&g_login_type=1&g_ty=ls',
         'headers': {
             'Cookie': cookie,
             'Accept': '*/*',
             'Connection': 'keep-alive',
             'Referer': _0x2baabb['QivTT'],
             'Accept-Encoding': _0x2baabb['XOqnw'],
             'Host': _0x2baabb['SlgTw'],
             'User-Agent': 'jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/' + (_0x2baabb['UFcdX'](Math['random'], 0x62) + 0x1) + ';pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
             'Accept-Language': _0x2baabb['xJxwL']
         },
         'timeout': 0x2710
     };
 }

 function showMsg() {
     var _0x1eb9ab = {
         'uJKmP': function(_0x55dadd, _0x9f0cfd) {
             return _0x55dadd === _0x9f0cfd;
         },
         'gNFGb': function(_0xd933c3, _0x2618a6) {
             return _0xd933c3 === _0x2618a6;
         },
         'SzWbC': function(_0xedd4a, _0xd951ad) {
             return _0xedd4a === _0xd951ad;
         },
         'QJmwv': 'fzumZ',
         'BcgfN': function(_0x3c9273, _0x1462bf) {
             return _0x3c9273 === _0x1462bf;
         },
         'Rkgax': 'yDCRw',
         'cTPAO': function(_0x4830b9) {
             return _0x4830b9();
         }
     };
     return new Promise(async _0x27c63a => {
         if (_0x1eb9ab['SzWbC']('fzumZ', _0x1eb9ab['QJmwv'])) {
             if ($['result']['length']) {
                 if ($['notifyTime']) {
                     const _0x1f1f1d = $['notifyTime']['split'](',')['map'](_0x2a4cc8 => _0x2a4cc8['split'](':'));
                     const _0x3918ff = $['time']('HH:mm')['split'](':');
                     $['log']('\x0a' + JSON['stringify'](_0x1f1f1d));
                     $['log']('\x0a' + JSON['stringify'](_0x3918ff));
                     if (_0x1f1f1d['some'](_0x3c1caa => _0x3c1caa[0x0] === _0x3918ff[0x0] && (!_0x3c1caa[0x1] || _0x3c1caa[0x1] === _0x3918ff[0x1]))) {
                         $['msg']($['name'], '', '' + $['result']['join']('\x0a'));
                     }
                 } else {
                     if (_0x1eb9ab['BcgfN'](_0x1eb9ab['Rkgax'], _0x1eb9ab['Rkgax'])) {
                         $['msg']($['name'], '', '' + $['result']['join']('\x0a'));
                     } else {
                         console['log']('超级助力(超级工人)结果:' + data);
                         const {
                             sErrMsg,
                             iRet
                         } = JSON['parse'](data);
                         if (_0x1eb9ab['uJKmP'](iRet, 0x7d5) || _0x1eb9ab['gNFGb'](iRet, 0x270f)) $['canHelp'] = ![];
                     }
                 }
                 if ($['isNode']() && process['env']['CFD_NOTIFY_CONTROL']) await notify['sendNotify']($['name'] + ' - 账号' + $['index'] + ' - ' + $['nickName'], '' + $['result']['join']('\x0a'));
             }
             _0x1eb9ab['cTPAO'](_0x27c63a);
         } else {
             console['log']('' + JSON['stringify'](err));
             console['log']($['name'] + ' getMoney_dwSource_1 API请求失败，请检查网路重试');
         }
     });
 }

 function readShareCode() {
     var _0x2f5988 = {
         'CgLfy': function(_0x55b1b1, _0x143256) {
             return _0x55b1b1 === _0x143256;
         },
         'zSKmp': function(_0x22940b, _0x480f78) {
             return _0x22940b !== _0x480f78;
         },
         'eKQvv': 'xMwTq',
         'gtYti': 'RhMMj',
         'rcyHo': 'bvGKy',
         'Mnsiy': function(_0x170b1d, _0x4fb0a3) {
             return _0x170b1d === _0x4fb0a3;
         },
         'vkYjx': 'HXFLm',
         'TVcxe': function(_0x766e22, _0x3b00c0) {
             return _0x766e22(_0x3b00c0);
         },
         'mmEnq': function(_0x4617aa) {
             return _0x4617aa();
         }
     };
     console['log']('开始');
     return new Promise(async _0xe6038b => {
         $['get']({
             'url': 'https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/cfd.json' + randomCount + '/',
             'timeout': 0x2710
         }, (_0x25246f, _0x365cb1, _0x535991) => {
             var _0x3b29d3 = {
                 'UUsHP': function(_0x50128d) {
                     return _0x50128d();
                 }
             };
             if (_0x2f5988['CgLfy']('AYOXv', 'mJvVt')) {
                 _0x3b29d3['UUsHP'](_0xe6038b);
             } else {
                 try {
                     if (_0x2f5988['zSKmp'](_0x2f5988['eKQvv'], _0x2f5988['gtYti'])) {
                         if (_0x25246f) {
                             if (_0x2f5988['CgLfy']('bvGKy', _0x2f5988['rcyHo'])) {
                                 console['log']('' + JSON['stringify'](_0x25246f));
                                 console['log']($['name'] + ' API请求失败，请检查网路重试');
                             } else {
                                 const {
                                     dwGetMoney,
                                     iRet,
                                     sErrMsg
                                 } = JSON['parse'](_0x535991);
                                 $['log']('\n🤏偷取好友【' + strFriendNick + '】【' + strSceneName + '】财富值：¥ ' + (dwGetMoney ? dwGetMoney : sErrMsg) + '\x0a' + ($['showLog'] ? _0x535991 : ''));
                             }
                         } else {
                             if (_0x535991) {
                                 if (_0x2f5988['Mnsiy']('wWOxq', _0x2f5988['vkYjx'])) {
                                     _0xe6038b();
                                 } else {
                                     console['log']('随机取' + randomCount + '个码放到您固定的互助码后面(不影响已有固定互助)');
                                     _0x535991 = JSON['parse'](_0x535991);
                                 }
                             }
                         }
                     } else {
                         $['logErr'](e, _0x365cb1);
                     }
                 } catch (_0x2dad6a) {
                     $['logErr'](_0x2dad6a, _0x365cb1);
                 } finally {
                     _0x2f5988['TVcxe'](_0xe6038b, _0x535991);
                 }
             }
         });
         await $['wait'](0x2710);
         _0x2f5988['mmEnq'](_0xe6038b);
     });
 }

 function shareCodesFormat() {
     var _0x4b5b8e = {
         'LanMq': function(_0x5b142f, _0x1f1357) {
             return _0x5b142f === _0x1f1357;
         },
         'QIzuP': 'TUCnm',
         'DYtvR': function(_0x1a3e89, _0x445e88) {
             return _0x1a3e89 - _0x445e88;
         },
         'uKlcq': function(_0xf3e1c9) {
             return _0xf3e1c9();
         },
         'voMqY': function(_0xfafb23, _0x2a6775) {
             return _0xfafb23 !== _0x2a6775;
         },
         'lTKOG': 'zCAxH',
         'edBLI': 'AE9A1A36CE90E035A19DC751D9557899D5ED1C1C67FD467D91E4D0DE3930D809',
         'ycxVs': function(_0x25019c) {
             return _0x25019c();
         }
     };
     return new Promise(async _0x209a3a => {
         var _0x150adb = {
             'ecvRh': 'jd_jxCFD'
         };
         if (_0x4b5b8e['LanMq']('ohyNY', _0x4b5b8e['QIzuP'])) {
             $['logErr'](e, resp);
         } else {
             $['newShareCodes'] = [];
             if ($['shareCodesArr'][$['index'] - 0x1]) {
                 $['newShareCodes'] = $['shareCodesArr'][_0x4b5b8e['DYtvR']($['index'], 0x1)]['split']('@');
             } else {
                 console['log']('由于您第' + $['index'] + '个京东账号未提供shareCode,将采纳本脚本自带的助力码\n');
                 $['newShareCodes'] = $['strMyShareIds'];
             }
             const _0x4cd7d2 = await _0x4b5b8e['uKlcq'](readShareCode);
             if (_0x4cd7d2 && _0x4cd7d2['code'] === 0xc8) {
                 if (_0x4b5b8e['voMqY'](_0x4b5b8e['lTKOG'], _0x4b5b8e['lTKOG'])) {
                     if ($['getdata']('jd_jxCFD')) $['shareCodesArr'] = $['getdata'](_0x150adb['ecvRh'])['split']('\x0a')['filter'](_0xa0775 => !!_0xa0775);
                     console['log']('\x0aBoxJs设置的京喜财富岛邀请码:' + $['getdata']('jd_jxCFD') + '\x0a');
                 } else {
                     $['newShareCodes'] = [...new Set([...$['newShareCodes'], ...$['strMyShareIds'], _0x4b5b8e['edBLI'], ..._0x4cd7d2['data'] || []])];
                 }
             }
             console['log']('第' + $['index'] + '个京东账号将要助力的好友' + JSON['stringify']($['newShareCodes']));
             _0x4b5b8e['ycxVs'](_0x209a3a);
         }
     });
 }

 function requireConfig() {
     var _0x42ab36 = {
         'pFkAn': 'success',
         'lyZfP': function(_0x13f3f7, _0x13f45b) {
             return _0x13f3f7 === _0x13f45b;
         },
         'kdtSz': 'xwfuE',
         'pruuf': 'VUCxm',
         'YUxtg': 'ElYZs',
         'gpWuB': function(_0x3de5ca) {
             return _0x3de5ca();
         }
     };
     return new Promise(_0x1184f6 => {
         var _0xd6533f = {
             'gnVVx': _0x42ab36['pFkAn']
         };
         console['log']('开始获取' + $['name'] + '配置文件\x0a');
         let _0x440ecb = [];
         if ($['isNode']() && process['env']['JDCFD_SHARECODES']) {
             if (process['env']['JDCFD_SHARECODES']['indexOf']('\x0a') > -0x1) {
                 if (_0x42ab36['lyZfP'](_0x42ab36['kdtSz'], _0x42ab36['kdtSz'])) {
                     _0x440ecb = process['env']['JDCFD_SHARECODES']['split']('\x0a');
                 } else {
                     if (err) {
                         console['log']('' + JSON['stringify'](err));
                         console['log']($['name'] + ' AchieveInfo API请求失败，请检查网路重试');
                     } else {
                         const {
                             iRet,
                             sErrMsg,
                             taskinfo = []
                         } = JSON['parse'](data);
                         $['allTask'] = taskinfo['filter'](_0x113f47 => _0x113f47['dwAwardStatus'] === 0x1);
                         $['log']('\n获取【🎖成就任务】列表 ' + sErrMsg + '，总共' + $['allTask']['length'] + '个任务！\n' + ($['showLog'] ? data : ''));
                     }
                 }
             } else {
                 if (_0x42ab36['lyZfP'](_0x42ab36['pruuf'], 'xnJbl')) {
                     const {
                         dwMoney,
                         iRet,
                         sErrMsg
                     } = JSON['parse'](data);
                     $['log']('\n【🏝寻宝大作战】【' + strBrandName + '】开宝箱：' + (sErrMsg == _0xd6533f['gnVVx'] ? ' 获得财富值 ¥ ' + dwMoney : sErrMsg) + '\x0a' + ($['showLog'] ? data : ''));
                 } else {
                     _0x440ecb = process['env']['JDCFD_SHARECODES']['split']('&');
                 }
             }
         }
         $['shareCodesArr'] = [];
         if ($['isNode']()) {
             if (_0x42ab36['YUxtg'] === _0x42ab36['YUxtg']) {
                 Object['keys'](_0x440ecb)['forEach'](_0x2c4e6d => {
                     if (_0x440ecb[_0x2c4e6d]) {
                         $['shareCodesArr']['push'](_0x440ecb[_0x2c4e6d]);
                     }
                 });
             } else {
                 return;
             }
         } else {
             if ($['getdata']('jd_jxCFD')) $['shareCodesArr'] = $['getdata']('jd_jxCFD')['split']('\x0a')['filter'](_0x117cc0 => !!_0x117cc0);
             console['log']('\nBoxJs设置的京喜财富岛邀请码:' + $['getdata']('jd_jxCFD') + '\x0a');
         }
         console['log']('您提供了' + $['shareCodesArr']['length'] + '个账号的' + $['name'] + '助力码\n');
         _0x42ab36['gpWuB'](_0x1184f6);
     });
 };
 _0xodq = 'jsjiami.com.v6'



function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}


!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}$.md5=A}(this);
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
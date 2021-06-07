/*
 *Progcessed By JSDec in 0.14s
 *JSDec - JSDec.js.org
 */
/*
京喜领88元红包
活动入口：京喜app-》我的-》京喜领88元红包
助力逻辑：先自己京东账号相互助力，如有剩余助力机会，则助力作者
温馨提示：如提示助力火爆，可尝试寻找京东客服
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js
==============Quantumult X==============
[task_local]
#京喜领88元红包
4 10 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js, tag=京喜领88元红包, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

==============Loon==============
[Script]
cron "4 10 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js,tag=京喜领88元红包

================Surge===============
京喜领88元红包 = type=cron,cronexp="4 10 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js

===============小火箭==========
京喜领88元红包 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxlhb.js, cronexpr="4 10 * * *", timeout=3600, enable=true
 */



const $ = new Env('京喜领88元红包');
$['packetIdArr'] = [];
const notify = $['isNode']() ? require('./sendNotify') : {};
const jdCookieNode = $['isNode']() ? require('./jdCookie.js') : {};
let cookiesArr = [],
    cookie = '';
if ($['isNode']()) {
    Object['keys'](jdCookieNode)['forEach'](_0x4551c2 => {
        cookiesArr['push'](jdCookieNode[_0x4551c2]);
    });
    if (process['env']['JD_DEBUG'] && process['env']['JD_DEBUG'] === 'false') console['log'] = () => {};
} else {
    cookiesArr = [$['getdata']('CookieJD'), $['getdata']('CookieJD2'), ...$['toObj']($['getdata']('CookiesJD') || '[]')['map'](_0x24190b => _0x24190b['cookie'])]['filter'](_0x5f3a8e => !!_0x5f3a8e);
}
const BASE_URL = 'https://wq.jd.com/cubeactive/steprewardv3';
!(async () => {
    var _0x2d5026 = {
        'eyxwW': function(_0x4d423f, _0x46519d) {
            return _0x4d423f(_0x46519d);
        },
        'zDZbM': 'tunnel',
        'Tsbag': function(_0x2992cd, _0x4ec440) {
            return _0x2992cd * _0x4ec440;
        },
        'ALmkV': 'https://bean.m.jd.com/bean/signIndex.action',
        'OlsAn': function(_0x32a0fc, _0x528499) {
            return _0x32a0fc + _0x528499;
        },
        'aWOmB': '京喜领88元红包\n',
        'Upxrg': '活动入口：京喜app-》我的-》京喜领88元红包\n',
        'ejWku': function(_0x557b93, _0x2ed8aa) {
            return _0x557b93(_0x2ed8aa);
        },
        'sPkRb': 'https://cdn.jsdelivr.net/gh/zero205/updateTeam@main/shareCodes/jxhb.json',
        'kiVAP': function(_0x4186ca, _0x500f27) {
            return _0x4186ca < _0x500f27;
        },
        'xbxBc': 'qwhhE',
        'KVcVd': '2|1|4|3|0',
        'SQhcH': function(_0x195832) {
            return _0x195832();
        },
        'fHCXr': function(_0x3600a7, _0x3b78f7) {
            return _0x3600a7(_0x3b78f7);
        },
        'KmRLX': 'GbRAM',
        'ClxNi': 'ANcsW',
        'milhs': function(_0x12abc2, _0x2e694e) {
            return _0x12abc2 === _0x2e694e;
        },
        'Itzar': 'userName',
        'KAMGL': 'strUserPin',
        'oMemA': function(_0x57a5ee, _0x2b51bd) {
            return _0x57a5ee(_0x2b51bd);
        },
        'YNDVG': function(_0x4bb3ab, _0x3eb953) {
            return _0x4bb3ab !== _0x3eb953;
        },
        'xAQVr': 'fVNGd',
        'fuMtF': 'PyhzL',
        'GYvpF': function(_0x4cda75, _0x7fc6b4) {
            return _0x4cda75(_0x7fc6b4);
        },
        'GLqEz': function(_0x234d73, _0x34c08e) {
            return _0x234d73 < _0x34c08e;
        },
        'FaDIO': 'YXiOZ',
        'tzgwX': function(_0x1b3a77, _0x54f1d5, _0x2a293d) {
            return _0x1b3a77(_0x54f1d5, _0x2a293d);
        }
    };
    if (!cookiesArr[0x0]) {
        $['msg']($['name'], '【提示】请先获取京东账号一cookie\x0a直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
            'open-url': _0x2d5026['ALmkV']
        });
        return;
    }
    console['log'](_0x2d5026['OlsAn'](_0x2d5026['OlsAn'](_0x2d5026['OlsAn'](_0x2d5026['aWOmB'], _0x2d5026['Upxrg']), '助力逻辑：先自己京东账号相互助力，如有剩余助力机会，则助力作者\n'), '温馨提示：如提示助力火爆，可尝试寻找京东客服'));
    let _0x25bc98 = (await _0x2d5026['ejWku'](getAuthorShareCode, _0x2d5026['sPkRb'])) || [];
    $['authorMyShareIds'] = _0x25bc98 || [];
    for (let _0x147f27 = 0x0; _0x2d5026['kiVAP'](_0x147f27, cookiesArr['length']); _0x147f27++) {
        if ('TdEVz' !== _0x2d5026['xbxBc']) {
            var _0x3a4533 = _0x2d5026['KVcVd']['split']('|'),
                _0x715eb9 = 0x0;
            while (!![]) {
                switch (_0x3a4533[_0x715eb9++]) {
                    case '0':
                        await _0x2d5026['SQhcH'](main);
                        continue;
                    case '1':
                        cookie = cookiesArr[_0x147f27];
                        continue;
                    case '2':
                        $['index'] = _0x2d5026['OlsAn'](_0x147f27, 0x1);
                        continue;
                    case '3':
                        console['log']('\x0a*****开始【京东账号' + $['index'] + '】' + ($['nickName'] || $['UserName']) + '*****\n');
                        continue;
                    case '4':
                        $['UserName'] = _0x2d5026['ejWku'](decodeURIComponent, cookie['match'](/pt_pin=([^; ]+)(?=;?)/) && cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);
                        continue;
                }
                break;
            }
        } else {
            console['log']('获取助力码失败：' + data['sErrMsg'] + '\x0a');
        }
    }
    let _0x3cc5a5 = [];
    $['packetIdArr']['map'](_0x4fea77 => _0x3cc5a5['push'](_0x4fea77['strUserPin']));
    console['log']('\x0a\x0a自己京东账号助力码：\x0a' + JSON['stringify'](_0x3cc5a5) + '\x0a\x0a');
    console['log']('\x0a开始助力：助力逻辑 先自己京东相互助力，如有剩余助力机会，则助力作者\x0a');
    for (let _0x290aa5 = 0x0; _0x290aa5 < cookiesArr['length']; _0x290aa5++) {
        cookie = cookiesArr[_0x290aa5];
        $['canHelp'] = !![];
        $['max'] = ![];
        $['UserName'] = _0x2d5026['fHCXr'](decodeURIComponent, cookie['match'](/pt_pin=([^; ]+)(?=;?)/) && cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);
        // for (let _0x2d52bd of $['packetIdArr']) {
        //     if (_0x2d5026['KmRLX'] !== _0x2d5026['ClxNi']) {
        //         if (!_0x2d52bd) continue;
        //         if (_0x2d5026['milhs']($['UserName'], _0x2d52bd[_0x2d5026['Itzar']])) continue;
        //         if (!$['canHelp']) break;
        //         if ($['max']) break;
        //         console['log']('【' + $['UserName'] + '】去助力【' + _0x2d52bd['userName'] + '】邀请码：' + _0x2d52bd[_0x2d5026['KAMGL']]);
        //         await _0x2d5026['oMemA'](enrollFriend, _0x2d52bd['strUserPin']);
        //         await $['wait'](0x3e8);
        //     } else {
        //         resolve(data);
        //     }
        // }
        if ($['canHelp']) {
            console['log']('\x0a【' + $['UserName'] + '】有剩余助力机会，开始助力作者\n');
            for (let _0x4c4334 of $['authorMyShareIds']) {
                if (_0x2d5026['YNDVG'](_0x2d5026['xAQVr'], _0x2d5026['fuMtF'])) {
                    if (!_0x4c4334) continue;
                    if (!$['canHelp']) break;
                    await _0x2d5026['GYvpF'](enrollFriend, _0x4c4334);
                    await $['wait'](0x3e8);
                    await $['wait'](0x3e8);
                    await $['wait'](0x3e8);
                } else {
                    $['log']('', '❌ ' + $['name'] + ', 失败! 原因: ' + e + '!', '');
                }
            }
        }
    }
    console['log']('\n开始拆红包\n');
    for (let _0x3de622 = 0x0; _0x2d5026['GLqEz'](_0x3de622, cookiesArr['length']); _0x3de622++) {
        if (_0x2d5026['YNDVG'](_0x2d5026['FaDIO'], _0x2d5026['FaDIO'])) {
            const _0x48aeb9 = _0x2d5026['eyxwW'](require, _0x2d5026['zDZbM']);
            const _0x108fba = {
                'https': _0x48aeb9['httpsOverHttp']({
                    'proxy': {
                        'host': process['env']['TG_PROXY_HOST'],
                        'port': _0x2d5026['Tsbag'](process['env']['TG_PROXY_PORT'], 0x1)
                    }
                })
            };
            Object['assign'](options, {
                'agent': _0x108fba
            });
        } else {
            cookie = cookiesArr[_0x3de622];
            $['canOpenGrade'] = !![];
            $['UserName'] = decodeURIComponent(cookie['match'](/pt_pin=([^; ]+)(?=;?)/) && cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);
            const _0x375bcc = [0x1, 0x2, 0x3, 0x4, 0x5, 0x6];
            for (let _0x40a18b of _0x375bcc) {
                if (!$['canOpenGrade']) break;
                console['log']('\x0a【' + $['UserName'] + '】去拆第' + _0x40a18b + '个红包');
                await _0x2d5026['tzgwX'](openRedPack, $['packetIdArr'][_0x3de622][_0x2d5026['KAMGL']], _0x40a18b);
                await $['wait'](0x3e8);
                await $['wait'](0x3e8);
            }
        }
    }
})()['catch'](_0x5dc411 => {
    $['log']('', '❌ ' + $['name'] + ', 失败! 原因: ' + _0x5dc411 + '!', '');
})['finally'](() => {
    $['done']();
});
async function main() {
    var _0x1ee6f4 = {
        'TXqtA': function(_0x27b403) {
            return _0x27b403();
        },
        'zcfGG': function(_0x3524b3) {
            return _0x3524b3();
        }
    };
    await _0x1ee6f4['TXqtA'](joinActive);
    await _0x1ee6f4['zcfGG'](getUserInfo);
}

function joinActive() {
    var _0x291af2 = {
        'hYJGx': function(_0x524450, _0x4f1770) {
            return _0x524450 === _0x4f1770;
        },
        'TlGXb': 'CWAta',
        'RamwL': 'FBAjC',
        'iWJqh': 'sCSwH',
        'JGmOc': function(_0x7dd724, _0x389289) {
            return _0x7dd724 !== _0x389289;
        },
        'WiTSp': 'KiEhE',
        'VkIbw': function(_0x4402a4, _0xf37975, _0x4b73e3, _0x1da4a4) {
            return _0x4402a4(_0xf37975, _0x4b73e3, _0x1da4a4);
        },
        'vpXnE': 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp'
    };
    return new Promise(_0x3c54b6 => {
        var _0x3fe02b = {
            'DmLnw': function(_0x841434, _0x2b4a96) {
                return _0x291af2['hYJGx'](_0x841434, _0x2b4a96);
            },
            'GFPVw': 'Cxcru',
            'hMIUc': _0x291af2['TlGXb'],
            'Phsts': 'JcxGx',
            'qLTJg': _0x291af2['RamwL'],
            'CPcsw': function(_0x3febed, _0x5b5b22) {
                return _0x3febed !== _0x5b5b22;
            },
            'uiKRm': _0x291af2['iWJqh']
        };
        if (_0x291af2['JGmOc'](_0x291af2['WiTSp'], _0x291af2['WiTSp'])) {
            console['log']('\x0a' + $['name'] + ':  API查询请求失败 ‼️‼️');
            $['logErr'](err);
        } else {
            const _0x2602ee = '';
            const _0x202c1f = _0x291af2['VkIbw'](taskurl, 'JoinActive', _0x2602ee, _0x291af2['vpXnE']);
            $['get'](_0x202c1f, (_0x16efd6, _0x1c66c6, _0x5c3768) => {
                var _0x268bb4 = {
                    'gJMTS': function(_0x34d4b8, _0x30459f) {
                        return _0x3fe02b['DmLnw'](_0x34d4b8, _0x30459f);
                    }
                };
                try {
                    if (_0x3fe02b['GFPVw'] !== _0x3fe02b['hMIUc']) {
                        if (_0x16efd6) {
                            console['log']('\x0a' + $['name'] + ':  API查询请求失败 ‼️‼️');
                            $['logErr'](_0x16efd6);
                        } else {
                            _0x5c3768 = JSON['parse'](_0x5c3768);
                            if (_0x3fe02b['DmLnw'](_0x5c3768['iRet'], 0x0)) {
                                if (_0x3fe02b['DmLnw'](_0x3fe02b['Phsts'], _0x3fe02b['qLTJg'])) {
                                    cookiesArr['push'](jdCookieNode[item]);
                                } else {
                                    console['log']('活动开启成功,助力邀请码为:' + _0x5c3768['Data']['strUserPin'] + '\x0a');
                                }
                            } else {
                                console['log']('活动开启失败：' + _0x5c3768['sErrMsg'] + '\x0a');
                            }
                        }
                    } else {
                        _0x5c3768 = JSON['parse'](_0x5c3768);
                        if (_0x268bb4['gJMTS'](_0x5c3768['iRet'], 0x0)) {
                            console['log']('获取助力码成功：' + _0x5c3768['Data']['strUserPin'] + '\x0a');
                            if (_0x5c3768['Data']['strUserPin']) {
                                $['packetIdArr']['push']({
                                    'strUserPin': _0x5c3768['Data']['strUserPin'],
                                    'userName': $['UserName']
                                });
                            }
                        } else {
                            console['log']('获取助力码失败：' + _0x5c3768['sErrMsg'] + '\x0a');
                        }
                    }
                } catch (_0x4feac1) {
                    if (_0x3fe02b['CPcsw']('sCSwH', _0x3fe02b['uiKRm'])) {
                        console['log']('\x0a' + $['name'] + ':  API查询请求失败 ‼️‼️');
                        $['logErr'](_0x16efd6);
                    } else {
                        $['logErr'](_0x4feac1, _0x1c66c6);
                    }
                } finally {
                    _0x3c54b6();
                }
            });
        }
    });
}

function getUserInfo() {
    var _0x18093b = {
        'FHGQR': function(_0x41d4d6, _0x90c62b) {
            return _0x41d4d6 === _0x90c62b;
        },
        'mPAld': 'rCsjn',
        'CYuwn': function(_0x4b1de1, _0xd0c28b) {
            return _0x4b1de1 === _0xd0c28b;
        },
        'NEEpl': 'MBWOu',
        'YPQaf': function(_0x418e2c, _0x5b6572) {
            return _0x418e2c !== _0x5b6572;
        },
        'zUODx': 'vUAJY',
        'WCDEv': 'fsUMX',
        'PmXYX': 'BMQNg',
        'PloSE': 'tUgHr',
        'YxJdo': 'yyyyMMdd',
        'EuxuM': function(_0x2c9ed8, _0x3a7353, _0x38f496, _0x45003f) {
            return _0x2c9ed8(_0x3a7353, _0x38f496, _0x45003f);
        },
        'TEcAj': 'GetUserInfo',
        'NWdPb': 'activeId,channel,joinDate,phoneid,publishFlag,timestamp'
    };
    return new Promise(_0x326fd4 => {
        const _0x53afe1 = 'joinDate=' + $['time'](_0x18093b['YxJdo']);
        const _0x1c09bb = _0x18093b['EuxuM'](taskurl, _0x18093b['TEcAj'], _0x53afe1, _0x18093b['NWdPb']);
        $['get'](_0x1c09bb, (_0x5a79cd, _0x15366a, _0x59e5c5) => {
            try {
                if (_0x5a79cd) {
                    if (_0x18093b['FHGQR']('rbLuL', 'rbLuL')) {
                        console['log']('\x0a' + $['name'] + ':  API查询请求失败 ‼️‼️');
                        $['logErr'](_0x5a79cd);
                    } else {
                        $['packetIdArr']['push']({
                            'strUserPin': _0x59e5c5['Data']['strUserPin'],
                            'userName': $['UserName']
                        });
                    }
                } else {
                    if (_0x18093b['mPAld'] !== _0x18093b['mPAld']) {
                        $['logErr'](e, _0x15366a);
                    } else {
                        _0x59e5c5 = JSON['parse'](_0x59e5c5);
                        if (_0x59e5c5['iRet'] === 0x0) {
                            console['log']('获取助力码成功：' + _0x59e5c5['Data']['strUserPin'] + '\x0a');
                            if (_0x59e5c5['Data']['strUserPin']) {
                                if (_0x18093b['CYuwn'](_0x18093b['NEEpl'], 'MBWOu')) {
                                    $['packetIdArr']['push']({
                                        'strUserPin': _0x59e5c5['Data']['strUserPin'],
                                        'userName': $['UserName']
                                    });
                                } else {
                                    $['logErr'](e, _0x15366a);
                                }
                            }
                        } else {
                            if (_0x18093b['YPQaf'](_0x18093b['zUODx'], _0x18093b['zUODx'])) {
                                console['log']('活动开启成功,助力邀请码为:' + _0x59e5c5['Data']['strUserPin'] + '\x0a');
                            } else {
                                console['log']('获取助力码失败：' + _0x59e5c5['sErrMsg'] + '\x0a');
                            }
                        }
                    }
                }
            } catch (_0x45d61b) {
                if (_0x18093b['WCDEv'] !== _0x18093b['WCDEv']) {
                    _0x59e5c5 = JSON['parse'](_0x59e5c5);
                    if (_0x59e5c5['iRet'] === 0x0) {
                        console['log']('活动开启成功,助力邀请码为:' + _0x59e5c5['Data']['strUserPin'] + '\x0a');
                    } else {
                        console['log']('活动开启失败：' + _0x59e5c5['sErrMsg'] + '\x0a');
                    }
                } else {
                    $['logErr'](_0x45d61b, _0x15366a);
                }
            } finally {
                if (_0x18093b['YPQaf'](_0x18093b['PmXYX'], _0x18093b['PloSE'])) {
                    _0x326fd4(_0x59e5c5);
                } else {
                    if (_0x59e5c5) _0x59e5c5 = JSON['parse'](_0x59e5c5);
                }
            }
        });
    });
}

function enrollFriend(_0x6a2b53) {
    var _0x572d28 = {
        'yRuqc': function(_0x11732b, _0x2bba89) {
            return _0x11732b === _0x2bba89;
        },
        'eSPKY': 'CchPv',
        'QJKUf': 'JxCQW',
        'LdXaE': function(_0x28d34a) {
            return _0x28d34a();
        },
        'zFHao': 'EnrollFriend'
    };
    return new Promise(_0x697ecf => {
        var _0x42cead = {
            'lyWoU': function(_0x423755, _0x587f72) {
                return _0x572d28['yRuqc'](_0x423755, _0x587f72);
            },
            'evVXF': function(_0x4a0f24, _0x57ad18) {
                return _0x4a0f24 === _0x57ad18;
            },
            'OHaAC': _0x572d28['eSPKY'],
            'KRrzu': 'kHmYB',
            'UUDvK': '助力结果',
            'yLSLM': function(_0x460da3, _0x1a278d) {
                return _0x572d28['yRuqc'](_0x460da3, _0x1a278d);
            },
            'ZfZsN': _0x572d28['QJKUf'],
            'Nwkdh': function(_0x6720f2, _0x1a6c24) {
                return _0x6720f2 === _0x1a6c24;
            },
            'rUsvX': function(_0x3b3f72) {
                return _0x572d28['LdXaE'](_0x3b3f72);
            }
        };
        const _0xd1bb34 = 'strPin=' + _0x6a2b53 + '&joinDate=' + $['time']('yyyyMMdd');
        const _0x3e25e7 = taskurl(_0x572d28['zFHao'], _0xd1bb34, 'activeId,channel,joinDate,phoneid,publishFlag,strPin,timestamp');
        $['get'](_0x3e25e7, (_0x4a7e59, _0x3c8c7c, _0x51b342) => {
            if (_0x42cead['evVXF'](_0x42cead['OHaAC'], _0x42cead['OHaAC'])) {
                try {
                    if (_0x4a7e59) {
                        if (_0x42cead['KRrzu'] === 'kHmYB') {
                            console['log']('\x0a' + $['name'] + ':  API查询请求失败 ‼️‼️');
                            $['logErr'](_0x4a7e59);
                        } else {
                            if (_0x51b342['iRet'] === 0x7df) $['canHelp'] = ![];
                            if (_0x42cead['lyWoU'](_0x51b342['iRet'], 0x7e0)) {
                                $['canHelp'] = ![];
                                console['log']('\n温馨提示：如提示助力火爆，可尝试寻找京东客服\n');
                            }
                            if (_0x42cead['lyWoU'](_0x51b342['iRet'], 0x7dd)) $['max'] = !![];
                            console['log']('助力失败:' + _0x51b342['sErrMsg'] + '\x0a');
                        }
                    } else {
                        console['log'](_0x42cead['UUDvK'], _0x51b342);
                        _0x51b342 = JSON['parse'](_0x51b342);
                        if (_0x51b342['iRet'] === 0x0) {
                            if (_0x42cead['yLSLM'](_0x42cead['ZfZsN'], _0x42cead['ZfZsN'])) {
                                console['log']('助力成功:' + _0x51b342['sErrMsg'] + '\x0a');
                            } else {
                                url += '&_stk=' + encodeURIComponent(stk);
                            }
                        } else {
                            if (_0x42cead['Nwkdh'](_0x51b342['iRet'], 0x7df)) $['canHelp'] = ![];
                            if (_0x42cead['Nwkdh'](_0x51b342['iRet'], 0x7e0)) {
                                $['canHelp'] = ![];
                                console['log']('\n温馨提示：如提示助力火爆，可尝试寻找京东客服\n');
                            }
                            if (_0x51b342['iRet'] === 0x7dd) $['max'] = !![];
                            console['log']('助力失败:' + _0x51b342['sErrMsg'] + '\x0a');
                        }
                    }
                } catch (_0xb3da1c) {
                    $['logErr'](_0xb3da1c, _0x3c8c7c);
                } finally {
                    _0x42cead['rUsvX'](_0x697ecf);
                }
            } else {
                console['log']('获取助力码成功：' + _0x51b342['Data']['strUserPin'] + '\x0a');
                if (_0x51b342['Data']['strUserPin']) {
                    $['packetIdArr']['push']({
                        'strUserPin': _0x51b342['Data']['strUserPin'],
                        'userName': $['UserName']
                    });
                }
            }
        });
    });
}

function openRedPack(_0x159e8e, _0x47cac2) {
    var _0x5c93af = {
        'YNBma': function(_0x1f17a8, _0x1fd16a) {
            return _0x1f17a8 !== _0x1fd16a;
        },
        'QTUyP': 'RBrkh',
        'NKdPv': function(_0x4606a4, _0x36bdcc) {
            return _0x4606a4 === _0x36bdcc;
        },
        'YjKrY': 'mUiot',
        'uzAkG': 'oaoPu',
        'XckDG': 'CjCeC',
        'nFQfs': 'AKtOZ',
        'jDIiu': 'lMRAF',
        'nJoAj': function(_0xf767d3, _0x2931a3) {
            return _0xf767d3 !== _0x2931a3;
        },
        'YkXKC': 'BQWSs',
        'vkPAM': function(_0x5a3833) {
            return _0x5a3833();
        },
        'CuPbm': function(_0x4ba8ed, _0x2637d1) {
            return _0x4ba8ed + _0x2637d1;
        },
        'SbNdK': function(_0x5a4e45, _0x34bf51) {
            return _0x5a4e45(_0x34bf51);
        },
        'uJdLg': '*/*',
        'XbgsL': 'zh-cn',
        'dfjqe': 'https://wqactive.jd.com/cube/front/activePublish/step_reward/489177.html?aid=489177',
        'eoqmY': 'false',
        'JXeix': function(_0x1da634, _0x4ce482) {
            return _0x1da634 > _0x4ce482;
        },
        'bvpcZ': 'GITHUB',
        'vCQks': function(_0x3fcd7f) {
            return _0x3fcd7f();
        },
        'TnkBw': 'DoGradeDraw',
        'iQhmu': 'activeId,channel,grade,phoneid,publishFlag,stepreward_jstoken,strPin,timestamp'
    };
    return new Promise(_0x4b714d => {
        var _0x3c03a3 = {
            'Oulyy': function(_0x5c816c, _0xa4f83f) {
                return _0x5c816c + _0xa4f83f;
            },
            'fwLHp': function(_0x5078e7, _0x345ccf) {
                return _0x5078e7 + _0x345ccf;
            },
            'ksraf': function(_0x33a120, _0x524a00) {
                return _0x5c93af['CuPbm'](_0x33a120, _0x524a00);
            },
            'anpEk': function(_0x223a4c, _0x24438e) {
                return _0x5c93af['SbNdK'](_0x223a4c, _0x24438e);
            },
            'IFjqi': _0x5c93af['uJdLg'],
            'feaaJ': _0x5c93af['XbgsL'],
            'MzMSn': _0x5c93af['dfjqe'],
            'VnhsW': _0x5c93af['eoqmY'],
            'LKvhA': function(_0x25748a, _0x16f141) {
                return _0x5c93af['JXeix'](_0x25748a, _0x16f141);
            },
            'qfWrH': _0x5c93af['bvpcZ'],
            'ZjUbK': function(_0x10400a) {
                return _0x5c93af['vCQks'](_0x10400a);
            },
            'XlRpr': function(_0x5b02d8, _0x30e447) {
                return _0x5c93af['NKdPv'](_0x5b02d8, _0x30e447);
            }
        };
        const _0x1fa838 = 'strPin=' + _0x159e8e + '&grade=' + _0x47cac2;
        const _0x5c3b84 = taskurl(_0x5c93af['TnkBw'], _0x1fa838, _0x5c93af['iQhmu']);
        $['get'](_0x5c3b84, (_0x5b0b55, _0x3e9c42, _0x37fd23) => {
            try {
                if (_0x5b0b55) {
                    if (_0x5c93af['YNBma'](_0x5c93af['QTUyP'], 'RBrkh')) {
                        if (_0x5b0b55) {} else {
                            if (_0x37fd23) _0x37fd23 = JSON['parse'](_0x37fd23);
                        }
                    } else {
                        console['log']('\x0a' + $['name'] + ':  API查询请求失败 ‼️‼️');
                        $['logErr'](_0x5b0b55);
                    }
                } else {
                    if (_0x5c93af['NKdPv'](_0x5c93af['YjKrY'], _0x5c93af['uzAkG'])) {
                        let _0x355ea0 = BASE_URL + '/' + functionId + '?activeId=489177&publishFlag=1&channel=7&' + _0x1fa838 + '&sceneval=2&g_login_type=1&timestamp=' + Date['now']() + '&_=' + _0x3c03a3['Oulyy'](Date['now'](), 0x2) + '&_ste=1';
                        const _0x35b584 = _0x3c03a3['fwLHp'](_0x3c03a3['fwLHp'](_0x3c03a3['ksraf'](_0x3c03a3['ksraf'](Math['random']()['toString'](0x24)['slice'](0x2, 0xa), Math['random']()['toString'](0x24)['slice'](0x2, 0xa)), Math['random']()['toString'](0x24)['slice'](0x2, 0xa)), Math['random']()['toString'](0x24)['slice'](0x2, 0xa)), Math['random']()['toString'](0x24)['slice'](0x2, 0xa));
                        _0x355ea0 += '&phoneid=' + _0x35b584;
                        _0x355ea0 += '&stepreward_jstoken=' + (_0x3c03a3['ksraf'](_0x3c03a3['ksraf'](Math['random']()['toString'](0x24)['slice'](0x2, 0xa), Math['random']()['toString'](0x24)['slice'](0x2, 0xa)), Math['random']()['toString'](0x24)['slice'](0x2, 0xa)) + Math['random']()['toString'](0x24)['slice'](0x2, 0xa));
                        if (stk) {
                            _0x355ea0 += '&_stk=' + _0x3c03a3['anpEk'](encodeURIComponent, stk);
                        }
                        return {
                            'url': _0x355ea0,
                            'headers': {
                                'Host': 'wq.jd.com',
                                'Cookie': cookie,
                                'accept': _0x3c03a3['IFjqi'],
                                'user-agent': 'jdpingou;iPhone;4.8.2;14.5.1;' + _0x35b584 + ';network/wifi;model/iPhone13,4;appBuild/100546;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/318;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                                'accept-language': _0x3c03a3['feaaJ'],
                                'referer': _0x3c03a3['MzMSn']
                            }
                        };
                    } else {
                        _0x37fd23 = JSON['parse'](_0x37fd23);
                        if (_0x37fd23['iRet'] === 0x0) {
                            console['log']('拆红包成功:' + _0x37fd23['sErrMsg'] + '\x0a');
                        } else {
                            if (_0x5c93af['YNBma'](_0x5c93af['XckDG'], _0x5c93af['nFQfs'])) {
                                if (_0x5c93af['NKdPv'](_0x37fd23['iRet'], 0x7e1)) $['canOpenGrade'] = ![];
                                console['log']('拆红包失败:' + _0x37fd23['sErrMsg'] + '\x0a');
                            } else {
                                Object['keys'](jdCookieNode)['forEach'](_0x45905d => {
                                    cookiesArr['push'](jdCookieNode[_0x45905d]);
                                });
                                if (process['env']['JD_DEBUG'] && process['env']['JD_DEBUG'] === _0x3c03a3['VnhsW']) console['log'] = () => {};
                                if (_0x3c03a3['LKvhA'](JSON['stringify'](process['env'])['indexOf'](_0x3c03a3['qfWrH']), -0x1)) process['exit'](0x0);
                            }
                        }
                    }
                }
            } catch (_0x3c1c07) {
                if (_0x5c93af['YNBma'](_0x5c93af['jDIiu'], _0x5c93af['jDIiu'])) {
                    _0x3c03a3['ZjUbK'](_0x4b714d);
                } else {
                    $['logErr'](_0x3c1c07, _0x3e9c42);
                }
            } finally {
                if (_0x5c93af['nJoAj']('BQWSs', _0x5c93af['YkXKC'])) {
                    _0x37fd23 = JSON['parse'](_0x37fd23);
                    if (_0x3c03a3['XlRpr'](_0x37fd23['iRet'], 0x0)) {
                        console['log']('拆红包成功:' + _0x37fd23['sErrMsg'] + '\x0a');
                    } else {
                        if (_0x3c03a3['XlRpr'](_0x37fd23['iRet'], 0x7e1)) $['canOpenGrade'] = ![];
                        console['log']('拆红包失败:' + _0x37fd23['sErrMsg'] + '\x0a');
                    }
                } else {
                    _0x5c93af['vkPAM'](_0x4b714d);
                }
            }
        });
    });
}

function getAuthorShareCode(_0x597a72 = 'https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/jxhb.json') {
    var _0x43d5e2 = {
        'hAyrW': function(_0x3a9084, _0x3d3e89) {
            return _0x3a9084 === _0x3d3e89;
        },
        'QEUsw': function(_0xf509b3, _0x5e69b1) {
            return _0xf509b3 === _0x5e69b1;
        },
        'QhAYU': 'UqzRB',
        'xRDdR': function(_0x18e43e, _0x539e53) {
            return _0x18e43e !== _0x539e53;
        },
        'eGprB': 'ukwnN',
        'vvTVf': 'AnRbf',
        'YEEwF': 'ODbSv',
        'FHUXU': 'jgAdE',
        'kiSRY': function(_0x28c305, _0xffc799) {
            return _0x28c305(_0xffc799);
        },
        'NkZjt': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88',
        'fAJrY': function(_0x14deb6, _0x2caef8) {
            return _0x14deb6 !== _0x2caef8;
        },
        'IBDlZ': 'qwswh',
        'rckiD': 'tunnel'
    };
    return new Promise(_0x3f40ce => {
        const _0x561d47 = {
            'url': _0x597a72 + '?' + new Date(),
            'timeout': 0x2710,
            'headers': {
                'User-Agent': _0x43d5e2['NkZjt']
            }
        };
        if ($['isNode']() && process['env']['TG_PROXY_HOST'] && process['env']['TG_PROXY_PORT']) {
            if (_0x43d5e2['fAJrY']('dPOvl', _0x43d5e2['IBDlZ'])) {
                const _0x297a73 = require(_0x43d5e2['rckiD']);
                const _0x118799 = {
                    'https': _0x297a73['httpsOverHttp']({
                        'proxy': {
                            'host': process['env']['TG_PROXY_HOST'],
                            'port': process['env']['TG_PROXY_PORT'] * 0x1
                        }
                    })
                };
                Object['assign'](_0x561d47, {
                    'agent': _0x118799
                });
            } else {
                console['log']('助力结果', data);
                data = JSON['parse'](data);
                if (_0x43d5e2['hAyrW'](data['iRet'], 0x0)) {
                    console['log']('助力成功:' + data['sErrMsg'] + '\x0a');
                } else {
                    if (_0x43d5e2['QEUsw'](data['iRet'], 0x7df)) $['canHelp'] = ![];
                    if (_0x43d5e2['QEUsw'](data['iRet'], 0x7e0)) {
                        $['canHelp'] = ![];
                        console['log']('\n温馨提示：如提示助力火爆，可尝试寻找京东客服\n');
                    }
                    if (data['iRet'] === 0x7dd) $['max'] = !![];
                    console['log']('助力失败:' + data['sErrMsg'] + '\x0a');
                }
            }
        }
        $['get'](_0x561d47, async (_0x380fb9, _0x38eb34, _0x127c24) => {
            var _0x1a924b = {
                'gZbuZ': 'https://bean.m.jd.com/bean/signIndex.action'
            };
            if (_0x43d5e2['QEUsw'](_0x43d5e2['QhAYU'], 'cPtUJ')) {
                console['log']('\x0a' + $['name'] + ':  API查询请求失败 ‼️‼️');
                $['logErr'](_0x380fb9);
            } else {
                try {
                    if (_0x43d5e2['xRDdR'](_0x43d5e2['eGprB'], _0x43d5e2['vvTVf'])) {
                        if (_0x380fb9) {} else {
                            if (_0x127c24) _0x127c24 = JSON['parse'](_0x127c24);
                        }
                    } else {
                        $['msg']($['name'], '【提示】请先获取京东账号一cookie\x0a直接使用NobyDa的京东签到获取', _0x1a924b['gZbuZ'], {
                            'open-url': _0x1a924b['gZbuZ']
                        });
                        return;
                    }
                } catch (_0x437c5f) {} finally {
                    if (_0x43d5e2['xRDdR'](_0x43d5e2['YEEwF'], _0x43d5e2['FHUXU'])) {
                        _0x43d5e2['kiSRY'](_0x3f40ce, _0x127c24);
                    } else {
                        $['logErr'](e, _0x38eb34);
                    }
                }
            }
        });
    });
}

function taskurl(_0x3cc5c2, _0xbcacf2 = '', _0x5470c2) {
    var _0x4be353 = {
        'VKAyR': function(_0x364534, _0x43ade2) {
            return _0x364534 + _0x43ade2;
        },
        'pwVBW': '*/*',
        'bbmDF': 'zh-cn',
        'ZzTOz': 'https://wqactive.jd.com/cube/front/activePublish/step_reward/489177.html?aid=489177'
    };
    let _0x19ec2c = BASE_URL + '/' + _0x3cc5c2 + '?activeId=489177&publishFlag=1&channel=7&' + _0xbcacf2 + '&sceneval=2&g_login_type=1&timestamp=' + Date['now']() + '&_=' + (Date['now']() + 0x2) + '&_ste=1';
    const _0x52892f = _0x4be353['VKAyR'](Math['random']()['toString'](0x24)['slice'](0x2, 0xa) + Math['random']()['toString'](0x24)['slice'](0x2, 0xa) + Math['random']()['toString'](0x24)['slice'](0x2, 0xa) + Math['random']()['toString'](0x24)['slice'](0x2, 0xa), Math['random']()['toString'](0x24)['slice'](0x2, 0xa));
    _0x19ec2c += '&phoneid=' + _0x52892f;
    _0x19ec2c += '&stepreward_jstoken=' + (_0x4be353['VKAyR'](Math['random']()['toString'](0x24)['slice'](0x2, 0xa), Math['random']()['toString'](0x24)['slice'](0x2, 0xa)) + Math['random']()['toString'](0x24)['slice'](0x2, 0xa) + Math['random']()['toString'](0x24)['slice'](0x2, 0xa));
    if (_0x5470c2) {
        _0x19ec2c += '&_stk=' + encodeURIComponent(_0x5470c2);
    }
    return {
        'url': _0x19ec2c,
        'headers': {
            'Host': 'wq.jd.com',
            'Cookie': cookie,
            'accept': _0x4be353['pwVBW'],
            'user-agent': 'jdpingou;iPhone;4.8.2;14.5.1;' + _0x52892f + ';network/wifi;model/iPhone13,4;appBuild/100546;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/318;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
            'accept-language': _0x4be353['bbmDF'],
            'referer': _0x4be353['ZzTOz']
        }
    };
};
_0xodD = 'jsjiami.com.v6';


function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            }))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
//公共变量
var hexcase=1;var b64pad="";var chrsz=8;var mode=32;
///MD5相关
function md5(A) {
	return hex_md5(A)
}
function hex_md5(A) {
	return binl2hex(core_md5(str2binl(A), A.length * chrsz))
}
function str_md5(A) {
	return binl2str(core_md5(str2binl(A), A.length * chrsz))
}
function hex_hmac_md5(A, B) {
	return binl2hex(core_hmac_md5(A, B))
}
function b64_hmac_md5(A, B) {
	return binl2b64(core_hmac_md5(A, B))
}
function str_hmac_md5(A, B) {
	return binl2str(core_hmac_md5(A, B))
}
function core_md5(K, F) {
	K[F >> 5] |= 128 << ((F) % 32);
	K[(((F + 64) >>> 9) << 4) + 14] = F;
	var J = 1732584193;
	var I = -271733879;
	var H = -1732584194;
	var G = 271733878;
	for (var C = 0; C < K.length; C += 16) {
		var E = J;
		var D = I;
		var B = H;
		var A = G;
		J = md5_ff(J, I, H, G, K[C + 0], 7, -680876936);
		G = md5_ff(G, J, I, H, K[C + 1], 12, -389564586);
		H = md5_ff(H, G, J, I, K[C + 2], 17, 606105819);
		I = md5_ff(I, H, G, J, K[C + 3], 22, -1044525330);
		J = md5_ff(J, I, H, G, K[C + 4], 7, -176418897);
		G = md5_ff(G, J, I, H, K[C + 5], 12, 1200080426);
		H = md5_ff(H, G, J, I, K[C + 6], 17, -1473231341);
		I = md5_ff(I, H, G, J, K[C + 7], 22, -45705983);
		J = md5_ff(J, I, H, G, K[C + 8], 7, 1770035416);
		G = md5_ff(G, J, I, H, K[C + 9], 12, -1958414417);
		H = md5_ff(H, G, J, I, K[C + 10], 17, -42063);
		I = md5_ff(I, H, G, J, K[C + 11], 22, -1990404162);
		J = md5_ff(J, I, H, G, K[C + 12], 7, 1804603682);
		G = md5_ff(G, J, I, H, K[C + 13], 12, -40341101);
		H = md5_ff(H, G, J, I, K[C + 14], 17, -1502002290);
		I = md5_ff(I, H, G, J, K[C + 15], 22, 1236535329);
		J = md5_gg(J, I, H, G, K[C + 1], 5, -165796510);
		G = md5_gg(G, J, I, H, K[C + 6], 9, -1069501632);
		H = md5_gg(H, G, J, I, K[C + 11], 14, 643717713);
		I = md5_gg(I, H, G, J, K[C + 0], 20, -373897302);
		J = md5_gg(J, I, H, G, K[C + 5], 5, -701558691);
		G = md5_gg(G, J, I, H, K[C + 10], 9, 38016083);
		H = md5_gg(H, G, J, I, K[C + 15], 14, -660478335);
		I = md5_gg(I, H, G, J, K[C + 4], 20, -405537848);
		J = md5_gg(J, I, H, G, K[C + 9], 5, 568446438);
		G = md5_gg(G, J, I, H, K[C + 14], 9, -1019803690);
		H = md5_gg(H, G, J, I, K[C + 3], 14, -187363961);
		I = md5_gg(I, H, G, J, K[C + 8], 20, 1163531501);
		J = md5_gg(J, I, H, G, K[C + 13], 5, -1444681467);
		G = md5_gg(G, J, I, H, K[C + 2], 9, -51403784);
		H = md5_gg(H, G, J, I, K[C + 7], 14, 1735328473);
		I = md5_gg(I, H, G, J, K[C + 12], 20, -1926607734);
		J = md5_hh(J, I, H, G, K[C + 5], 4, -378558);
		G = md5_hh(G, J, I, H, K[C + 8], 11, -2022574463);
		H = md5_hh(H, G, J, I, K[C + 11], 16, 1839030562);
		I = md5_hh(I, H, G, J, K[C + 14], 23, -35309556);
		J = md5_hh(J, I, H, G, K[C + 1], 4, -1530992060);
		G = md5_hh(G, J, I, H, K[C + 4], 11, 1272893353);
		H = md5_hh(H, G, J, I, K[C + 7], 16, -155497632);
		I = md5_hh(I, H, G, J, K[C + 10], 23, -1094730640);
		J = md5_hh(J, I, H, G, K[C + 13], 4, 681279174);
		G = md5_hh(G, J, I, H, K[C + 0], 11, -358537222);
		H = md5_hh(H, G, J, I, K[C + 3], 16, -722521979);
		I = md5_hh(I, H, G, J, K[C + 6], 23, 76029189);
		J = md5_hh(J, I, H, G, K[C + 9], 4, -640364487);
		G = md5_hh(G, J, I, H, K[C + 12], 11, -421815835);
		H = md5_hh(H, G, J, I, K[C + 15], 16, 530742520);
		I = md5_hh(I, H, G, J, K[C + 2], 23, -995338651);
		J = md5_ii(J, I, H, G, K[C + 0], 6, -198630844);
		G = md5_ii(G, J, I, H, K[C + 7], 10, 1126891415);
		H = md5_ii(H, G, J, I, K[C + 14], 15, -1416354905);
		I = md5_ii(I, H, G, J, K[C + 5], 21, -57434055);
		J = md5_ii(J, I, H, G, K[C + 12], 6, 1700485571);
		G = md5_ii(G, J, I, H, K[C + 3], 10, -1894986606);
		H = md5_ii(H, G, J, I, K[C + 10], 15, -1051523);
		I = md5_ii(I, H, G, J, K[C + 1], 21, -2054922799);
		J = md5_ii(J, I, H, G, K[C + 8], 6, 1873313359);
		G = md5_ii(G, J, I, H, K[C + 15], 10, -30611744);
		H = md5_ii(H, G, J, I, K[C + 6], 15, -1560198380);
		I = md5_ii(I, H, G, J, K[C + 13], 21, 1309151649);
		J = md5_ii(J, I, H, G, K[C + 4], 6, -145523070);
		G = md5_ii(G, J, I, H, K[C + 11], 10, -1120210379);
		H = md5_ii(H, G, J, I, K[C + 2], 15, 718787259);
		I = md5_ii(I, H, G, J, K[C + 9], 21, -343485551);
		J = safe_add(J, E);
		I = safe_add(I, D);
		H = safe_add(H, B);
		G = safe_add(G, A)
	}
	if (mode == 16) {
		return Array(I, H)
	} else {
		return Array(J, I, H, G)
	}
}
function md5_cmn(F, C, B, A, E, D) {
	return safe_add(bit_rol(safe_add(safe_add(C, F), safe_add(A, D)), E), B)
}
function md5_ff(C, B, G, F, A, E, D) {
	return md5_cmn((B & G) | ((~B) & F), C, B, A, E, D)
}
function md5_gg(C, B, G, F, A, E, D) {
	return md5_cmn((B & F) | (G & (~F)), C, B, A, E, D)
}
function md5_hh(C, B, G, F, A, E, D) {
	return md5_cmn(B ^ G ^ F, C, B, A, E, D)
}
function md5_ii(C, B, G, F, A, E, D) {
	return md5_cmn(G ^ (B | (~F)), C, B, A, E, D)
}
function core_hmac_md5(C, F) {
	var E = str2binl(C);
	if (E.length > 16) {
		E = core_md5(E, C.length * chrsz)
	}
	var A = Array(16),
	D = Array(16);
	for (var B = 0; B < 16; B++) {
		A[B] = E[B] ^ 909522486;
		D[B] = E[B] ^ 1549556828
	}
	var G = core_md5(A.concat(str2binl(F)), 512 + F.length * chrsz);
	return core_md5(D.concat(G), 512 + 128)
}
function safe_add(A, D) {
	var C = (A & 65535) + (D & 65535);
	var B = (A >> 16) + (D >> 16) + (C >> 16);
	return (B << 16) | (C & 65535)
}
function bit_rol(A, B) {
	return (A << B) | (A >>> (32 - B))
}
function str2binl(D) {
	var C = Array();
	var A = (1 << chrsz) - 1;
	for (var B = 0; B < D.length * chrsz; B += chrsz) {
		C[B >> 5] |= (D.charCodeAt(B / chrsz) & A) << (B % 32)
	}
	return C
}
function binl2str(C) {
	var D = "";
	var A = (1 << chrsz) - 1;
	for (var B = 0; B < C.length * 32; B += chrsz) {
		D += String.fromCharCode((C[B >> 5] >>> (B % 32)) & A)
	}
	return D
}
function binl2hex(C) {
	var B = hexcase ? "0123456789ABCDEF": "0123456789abcdef";
	var D = "";
	for (var A = 0; A < C.length * 4; A++) {
		D += B.charAt((C[A >> 2] >> ((A % 4) * 8 + 4)) & 15) + B.charAt((C[A >> 2] >> ((A % 4) * 8)) & 15)
	}
	return D
}
function binl2b64(D) {
	var C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var F = "";
	for (var B = 0; B < D.length * 4; B += 3) {
		var E = (((D[B >> 2] >> 8 * (B % 4)) & 255) << 16) | (((D[B + 1 >> 2] >> 8 * ((B + 1) % 4)) & 255) << 8) | ((D[B + 2 >> 2] >> 8 * ((B + 2) % 4)) & 255);
		for (var A = 0; A < 4; A++) {
			if (B * 8 + A * 6 > D.length * 32) {
				F += b64pad
			} else {
				F += C.charAt((E >> 6 * (3 - A)) & 63)
			}
		}
	}
	return F
}
function hexchar2bin(str) {
	var arr = [];
	for (var i = 0; i < str.length; i = i + 2) {
		arr.push("\\x" + str.substr(i, 2))
	}
	arr = arr.join("");
	eval("var temp = '" + arr + "'");
	return temp
}
function uin2hex(str) {
	var maxLength = 16;
	str = parseInt(str);
	var hex = str.toString(16);
	var len = hex.length;
	for (var i = len; i < maxLength; i++) {
		hex = "0" + hex
	}
	var arr = [];
	for (var j = 0; j < maxLength; j += 2) {
		arr.push("\\x" + hex.substr(j, 2))
	}
	var result = arr.join("");
	//eval('result="' + result + '"');
	return result
}
///MD5相关

///RSA相关
function h(z, t) {
	return new au(z, t)
}
function aj(aC, aD) {
	var t = "";
	var z = 0;
	while (z + aD < aC.length) {
		t += aC.substring(z, z + aD) + "\n";
		z += aD
	}
	return t + aC.substring(z, aC.length)
}
function u(t) {
	if (t < 16) {
		return "0" + t.toString(16)
	} else {
		return t.toString(16)
	}
}
function ah(aD, aG) {
	if (aG < aD.length + 11) {
		uv_alert("Message too long for RSA");
		return null
	}
	var aF = new Array();
	var aC = aD.length - 1;
	while (aC >= 0 && aG > 0) {
		var aE = aD.charCodeAt(aC--);
		aF[--aG] = aE
	}
	aF[--aG] = 0;
	var z = new af();
	var t = new Array();
	while (aG > 2) {
		t[0] = 0;
		while (t[0] == 0) {
			z.nextBytes(t)
		}
		aF[--aG] = t[0]
	}
	aF[--aG] = 2;
	aF[--aG] = 0;
	return new au(aF)
}
function N() {
	this.n = null;
	this.e = 0;
	this.d = null;
	this.p = null;
	this.q = null;
	this.dmp1 = null;
	this.dmq1 = null;
	this.coeff = null
}
function q(z, t) {
	if (z != null && t != null && z.length > 0 && t.length > 0) {
		this.n = h(z, 16);
		this.e = parseInt(t, 16)
	} else {
		uv_alert("Invalid RSA public key")
	}
}
function Y(t) {
	return t.modPowInt(this.e, this.n)
}
function r(aC) {
	var t = ah(aC, (this.n.bitLength() + 7) >> 3);
	if (t == null) {
		return null
	}
	var aD = this.doPublic(t);
	if (aD == null) {
		return null
	}
	var z = aD.toString(16);
	if ((z.length & 1) == 0) {
		return z
	} else {
		return "0" + z
	}
}
N.prototype.doPublic = Y;
N.prototype.setPublic = q;
N.prototype.encrypt = r;
var ay;
var ak = 244837814094590;
var ab = ((ak & 16777215) == 15715070);
function au(z, t, aC) {
	if (z != null) {
		if ("number" == typeof z) {
			this.fromNumber(z, t, aC)
		} else {
			if (t == null && "string" != typeof z) {
				this.fromString(z, 256)
			} else {
				this.fromString(z, t)
			}
		}
	}
}
function j() {
	return new au(null)
}
function b(aE, t, z, aD, aG, aF) {
	while (--aF >= 0) {
		var aC = t * this[aE++] + z[aD] + aG;
		aG = Math.floor(aC / 67108864);
		z[aD++] = aC & 67108863
	}
	return aG
}
function aA(aE, aJ, aK, aD, aH, t) {
	var aG = aJ & 32767,
	aI = aJ >> 15;
	while (--t >= 0) {
		var aC = this[aE] & 32767;
		var aF = this[aE++] >> 15;
		var z = aI * aC + aF * aG;
		aC = aG * aC + ((z & 32767) << 15) + aK[aD] + (aH & 1073741823);
		aH = (aC >>> 30) + (z >>> 15) + aI * aF + (aH >>> 30);
		aK[aD++] = aC & 1073741823
	}
	return aH
}
function az(aE, aJ, aK, aD, aH, t) {
	var aG = aJ & 16383,
	aI = aJ >> 14;
	while (--t >= 0) {
		var aC = this[aE] & 16383;
		var aF = this[aE++] >> 14;
		var z = aI * aC + aF * aG;
		aC = aG * aC + ((z & 16383) << 14) + aK[aD] + aH;
		aH = (aC >> 28) + (z >> 14) + aI * aF;
		aK[aD++] = aC & 268435455
	}
	return aH
}
/* colin block
if (ab && (navigator.appName == "Microsoft Internet Explorer")) {
	au.prototype.am = aA;
	ay = 30
} else {
	if (ab && (navigator.appName != "Netscape")) {
		au.prototype.am = b;
		ay = 26
	} else {
		au.prototype.am = az;
		ay = 28
	}
}
*/
au.prototype.am = aA;
ay = 30;
	
au.prototype.DB = ay;
au.prototype.DM = ((1 << ay) - 1);
au.prototype.DV = (1 << ay);
var ac = 52;
au.prototype.FV = Math.pow(2, ac);
au.prototype.F1 = ac - ay;
au.prototype.F2 = 2 * ay - ac;
var ag = "0123456789abcdefghijklmnopqrstuvwxyz";
var ai = new Array();
var ar, x;
ar = "0".charCodeAt(0);
for (x = 0; x <= 9; ++x) {
	ai[ar++] = x
}
ar = "a".charCodeAt(0);
for (x = 10; x < 36; ++x) {
	ai[ar++] = x
}
ar = "A".charCodeAt(0);
for (x = 10; x < 36; ++x) {
	ai[ar++] = x
}
function aB(t) {
	return ag.charAt(t)
}
function C(z, t) {
	var aC = ai[z.charCodeAt(t)];
	return (aC == null) ? -1 : aC
}
function aa(z) {
	for (var t = this.t - 1; t >= 0; --t) {
		z[t] = this[t]
	}
	z.t = this.t;
	z.s = this.s
}
function p(t) {
	this.t = 1;
	this.s = (t < 0) ? -1 : 0;
	if (t > 0) {
		this[0] = t
	} else {
		if (t < -1) {
			this[0] = t + DV
		} else {
			this.t = 0
		}
	}
}
function c(t) {
	var z = j();
	z.fromInt(t);
	return z
}
function y(aG, z) {
	var aD;
	if (z == 16) {
		aD = 4
	} else {
		if (z == 8) {
			aD = 3
		} else {
			if (z == 256) {
				aD = 8
			} else {
				if (z == 2) {
					aD = 1
				} else {
					if (z == 32) {
						aD = 5
					} else {
						if (z == 4) {
							aD = 2
						} else {
							this.fromRadix(aG, z);
							return
						}
					}
				}
			}
		}
	}
	this.t = 0;
	this.s = 0;
	var aF = aG.length,
	aC = false,
	aE = 0;
	while (--aF >= 0) {
		var t = (aD == 8) ? aG[aF] & 255 : C(aG, aF);
		if (t < 0) {
			if (aG.charAt(aF) == "-") {
				aC = true
			}
			continue
		}
		aC = false;
		if (aE == 0) {
			this[this.t++] = t
		} else {
			if (aE + aD > this.DB) {
				this[this.t - 1] |= (t & ((1 << (this.DB - aE)) - 1)) << aE;
				this[this.t++] = (t >> (this.DB - aE))
			} else {
				this[this.t - 1] |= t << aE
			}
		}
		aE += aD;
		if (aE >= this.DB) {
			aE -= this.DB
		}
	}
	if (aD == 8 && (aG[0] & 128) != 0) {
		this.s = -1;
		if (aE > 0) {
			this[this.t - 1] |= ((1 << (this.DB - aE)) - 1) << aE
		}
	}
	this.clamp();
	if (aC) {
		au.ZERO.subTo(this, this)
	}
}
function Q() {
	var t = this.s & this.DM;
	while (this.t > 0 && this[this.t - 1] == t) {--this.t
	}
}
function s(z) {
	if (this.s < 0) {
		return "-" + this.negate().toString(z)
	}
	var aC;
	if (z == 16) {
		aC = 4
	} else {
		if (z == 8) {
			aC = 3
		} else {
			if (z == 2) {
				aC = 1
			} else {
				if (z == 32) {
					aC = 5
				} else {
					if (z == 4) {
						aC = 2
					} else {
						return this.toRadix(z)
					}
				}
			}
		}
	}
	var aE = (1 << aC) - 1,
	aH,
	t = false,
	aF = "",
	aD = this.t;
	var aG = this.DB - (aD * this.DB) % aC;
	if (aD-->0) {
		if (aG < this.DB && (aH = this[aD] >> aG) > 0) {
			t = true;
			aF = aB(aH)
		}
		while (aD >= 0) {
			if (aG < aC) {
				aH = (this[aD] & ((1 << aG) - 1)) << (aC - aG);
				aH |= this[--aD] >> (aG += this.DB - aC)
			} else {
				aH = (this[aD] >> (aG -= aC)) & aE;
				if (aG <= 0) {
					aG += this.DB; --aD
				}
			}
			if (aH > 0) {
				t = true
			}
			if (t) {
				aF += aB(aH)
			}
		}
	}
	return t ? aF: "0"
}
function T() {
	var t = j();
	au.ZERO.subTo(this, t);
	return t
}
function an() {
	return (this.s < 0) ? this.negate() : this
}
function I(t) {
	var aC = this.s - t.s;
	if (aC != 0) {
		return aC
	}
	var z = this.t;
	aC = z - t.t;
	if (aC != 0) {
		return aC
	}
	while (--z >= 0) {
		if ((aC = this[z] - t[z]) != 0) {
			return aC
		}
	}
	return 0
}
function l(z) {
	var aD = 1,
	aC;
	if ((aC = z >>> 16) != 0) {
		z = aC;
		aD += 16
	}
	if ((aC = z >> 8) != 0) {
		z = aC;
		aD += 8
	}
	if ((aC = z >> 4) != 0) {
		z = aC;
		aD += 4
	}
	if ((aC = z >> 2) != 0) {
		z = aC;
		aD += 2
	}
	if ((aC = z >> 1) != 0) {
		z = aC;
		aD += 1
	}
	return aD
}
function w() {
	if (this.t <= 0) {
		return 0
	}
	return this.DB * (this.t - 1) + l(this[this.t - 1] ^ (this.s & this.DM))
}
function at(aC, z) {
	var t;
	for (t = this.t - 1; t >= 0; --t) {
		z[t + aC] = this[t]
	}
	for (t = aC - 1; t >= 0; --t) {
		z[t] = 0
	}
	z.t = this.t + aC;
	z.s = this.s
}
function Z(aC, z) {
	for (var t = aC; t < this.t; ++t) {
		z[t - aC] = this[t]
	}
	z.t = Math.max(this.t - aC, 0);
	z.s = this.s
}
function v(aH, aD) {
	var z = aH % this.DB;
	var t = this.DB - z;
	var aF = (1 << t) - 1;
	var aE = Math.floor(aH / this.DB),
	aG = (this.s << z) & this.DM,
	aC;
	for (aC = this.t - 1; aC >= 0; --aC) {
		aD[aC + aE + 1] = (this[aC] >> t) | aG;
		aG = (this[aC] & aF) << z
	}
	for (aC = aE - 1; aC >= 0; --aC) {
		aD[aC] = 0
	}
	aD[aE] = aG;
	aD.t = this.t + aE + 1;
	aD.s = this.s;
	aD.clamp()
}
function n(aG, aD) {
	aD.s = this.s;
	var aE = Math.floor(aG / this.DB);
	if (aE >= this.t) {
		aD.t = 0;
		return
	}
	var z = aG % this.DB;
	var t = this.DB - z;
	var aF = (1 << z) - 1;
	aD[0] = this[aE] >> z;
	for (var aC = aE + 1; aC < this.t; ++aC) {
		aD[aC - aE - 1] |= (this[aC] & aF) << t;
		aD[aC - aE] = this[aC] >> z
	}
	if (z > 0) {
		aD[this.t - aE - 1] |= (this.s & aF) << t
	}
	aD.t = this.t - aE;
	aD.clamp()
}
function ad(z, aD) {
	var aC = 0,
	aE = 0,
	t = Math.min(z.t, this.t);
	while (aC < t) {
		aE += this[aC] - z[aC];
		aD[aC++] = aE & this.DM;
		aE >>= this.DB
	}
	if (z.t < this.t) {
		aE -= z.s;
		while (aC < this.t) {
			aE += this[aC];
			aD[aC++] = aE & this.DM;
			aE >>= this.DB
		}
		aE += this.s
	} else {
		aE += this.s;
		while (aC < z.t) {
			aE -= z[aC];
			aD[aC++] = aE & this.DM;
			aE >>= this.DB
		}
		aE -= z.s
	}
	aD.s = (aE < 0) ? -1 : 0;
	if (aE < -1) {
		aD[aC++] = this.DV + aE
	} else {
		if (aE > 0) {
			aD[aC++] = aE
		}
	}
	aD.t = aC;
	aD.clamp()
}
function F(z, aD) {
	var t = this.abs(),
	aE = z.abs();
	var aC = t.t;
	aD.t = aC + aE.t;
	while (--aC >= 0) {
		aD[aC] = 0
	}
	for (aC = 0; aC < aE.t; ++aC) {
		aD[aC + t.t] = t.am(0, aE[aC], aD, aC, 0, t.t)
	}
	aD.s = 0;
	aD.clamp();
	if (this.s != z.s) {
		au.ZERO.subTo(aD, aD)
	}
}
function S(aC) {
	var t = this.abs();
	var z = aC.t = 2 * t.t;
	while (--z >= 0) {
		aC[z] = 0
	}
	for (z = 0; z < t.t - 1; ++z) {
		var aD = t.am(z, t[z], aC, 2 * z, 0, 1);
		if ((aC[z + t.t] += t.am(z + 1, 2 * t[z], aC, 2 * z + 1, aD, t.t - z - 1)) >= t.DV) {
			aC[z + t.t] -= t.DV;
			aC[z + t.t + 1] = 1
		}
	}
	if (aC.t > 0) {
		aC[aC.t - 1] += t.am(z, t[z], aC, 2 * z, 0, 1)
	}
	aC.s = 0;
	aC.clamp()
}
function G(aK, aH, aG) {
	var aQ = aK.abs();
	if (aQ.t <= 0) {
		return
	}
	var aI = this.abs();
	if (aI.t < aQ.t) {
		if (aH != null) {
			aH.fromInt(0)
		}
		if (aG != null) {
			this.copyTo(aG)
		}
		return
	}
	if (aG == null) {
		aG = j()
	}
	var aE = j(),
	z = this.s,
	aJ = aK.s;
	var aP = this.DB - l(aQ[aQ.t - 1]);
	if (aP > 0) {
		aQ.lShiftTo(aP, aE);
		aI.lShiftTo(aP, aG)
	} else {
		aQ.copyTo(aE);
		aI.copyTo(aG)
	}
	var aM = aE.t;
	var aC = aE[aM - 1];
	if (aC == 0) {
		return
	}
	var aL = aC * (1 << this.F1) + ((aM > 1) ? aE[aM - 2] >> this.F2: 0);
	var aT = this.FV / aL,
	aS = (1 << this.F1) / aL,
	aR = 1 << this.F2;
	var aO = aG.t,
	aN = aO - aM,
	aF = (aH == null) ? j() : aH;
	aE.dlShiftTo(aN, aF);
	if (aG.compareTo(aF) >= 0) {
		aG[aG.t++] = 1;
		aG.subTo(aF, aG)
	}
	au.ONE.dlShiftTo(aM, aF);
	aF.subTo(aE, aE);
	while (aE.t < aM) {
		aE[aE.t++] = 0
	}
	while (--aN >= 0) {
		var aD = (aG[--aO] == aC) ? this.DM: Math.floor(aG[aO] * aT + (aG[aO - 1] + aR) * aS);
		if ((aG[aO] += aE.am(0, aD, aG, aN, 0, aM)) < aD) {
			aE.dlShiftTo(aN, aF);
			aG.subTo(aF, aG);
			while (aG[aO] < --aD) {
				aG.subTo(aF, aG)
			}
		}
	}
	if (aH != null) {
		aG.drShiftTo(aM, aH);
		if (z != aJ) {
			au.ZERO.subTo(aH, aH)
		}
	}
	aG.t = aM;
	aG.clamp();
	if (aP > 0) {
		aG.rShiftTo(aP, aG)
	}
	if (z < 0) {
		au.ZERO.subTo(aG, aG)
	}
}
function P(t) {
	var z = j();
	this.abs().divRemTo(t, null, z);
	if (this.s < 0 && z.compareTo(au.ZERO) > 0) {
		t.subTo(z, z)
	}
	return z
}
function M(t) {
	this.m = t
}
function X(t) {
	if (t.s < 0 || t.compareTo(this.m) >= 0) {
		return t.mod(this.m)
	} else {
		return t
	}
}
function am(t) {
	return t
}
function L(t) {
	t.divRemTo(this.m, null, t)
}
function J(t, aC, z) {
	t.multiplyTo(aC, z);
	this.reduce(z)
}
function aw(t, z) {
	t.squareTo(z);
	this.reduce(z)
}
M.prototype.convert = X;
M.prototype.revert = am;
M.prototype.reduce = L;
M.prototype.mulTo = J;
M.prototype.sqrTo = aw;
function D() {
	if (this.t < 1) {
		return 0
	}
	var t = this[0];
	if ((t & 1) == 0) {
		return 0
	}
	var z = t & 3;
	z = (z * (2 - (t & 15) * z)) & 15;
	z = (z * (2 - (t & 255) * z)) & 255;
	z = (z * (2 - (((t & 65535) * z) & 65535))) & 65535;
	z = (z * (2 - t * z % this.DV)) % this.DV;
	return (z > 0) ? this.DV - z: -z
}
function g(t) {
	this.m = t;
	this.mp = t.invDigit();
	this.mpl = this.mp & 32767;
	this.mph = this.mp >> 15;
	this.um = (1 << (t.DB - 15)) - 1;
	this.mt2 = 2 * t.t
}
function al(t) {
	var z = j();
	t.abs().dlShiftTo(this.m.t, z);
	z.divRemTo(this.m, null, z);
	if (t.s < 0 && z.compareTo(au.ZERO) > 0) {
		this.m.subTo(z, z)
	}
	return z
}
function av(t) {
	var z = j();
	t.copyTo(z);
	this.reduce(z);
	return z
}
function R(t) {
	while (t.t <= this.mt2) {
		t[t.t++] = 0
	}
	for (var aC = 0; aC < this.m.t; ++aC) {
		var z = t[aC] & 32767;
		var aD = (z * this.mpl + (((z * this.mph + (t[aC] >> 15) * this.mpl) & this.um) << 15)) & t.DM;
		z = aC + this.m.t;
		t[z] += this.m.am(0, aD, t, aC, 0, this.m.t);
		while (t[z] >= t.DV) {
			t[z] -= t.DV;
			t[++z]++
		}
	}
	t.clamp();
	t.drShiftTo(this.m.t, t);
	if (t.compareTo(this.m) >= 0) {
		t.subTo(this.m, t)
	}
}
function ao(t, z) {
	t.squareTo(z);
	this.reduce(z)
}
function B(t, aC, z) {
	t.multiplyTo(aC, z);
	this.reduce(z)
}
g.prototype.convert = al;
g.prototype.revert = av;
g.prototype.reduce = R;
g.prototype.mulTo = B;
g.prototype.sqrTo = ao;
function k() {
	return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
}
function A(aH, aI) {
	if (aH > 4294967295 || aH < 1) {
		return au.ONE
	}
	var aG = j(),
	aC = j(),
	aF = aI.convert(this),
	aE = l(aH) - 1;
	aF.copyTo(aG);
	while (--aE >= 0) {
		aI.sqrTo(aG, aC);
		if ((aH & (1 << aE)) > 0) {
			aI.mulTo(aC, aF, aG)
		} else {
			var aD = aG;
			aG = aC;
			aC = aD
		}
	}
	return aI.revert(aG)
}
function ap(aC, t) {
	var aD;
	if (aC < 256 || t.isEven()) {
		aD = new M(t)
	} else {
		aD = new g(t)
	}
	return this.exp(aC, aD)
}
au.prototype.copyTo = aa;
au.prototype.fromInt = p;
au.prototype.fromString = y;
au.prototype.clamp = Q;
au.prototype.dlShiftTo = at;
au.prototype.drShiftTo = Z;
au.prototype.lShiftTo = v;
au.prototype.rShiftTo = n;
au.prototype.subTo = ad;
au.prototype.multiplyTo = F;
au.prototype.squareTo = S;
au.prototype.divRemTo = G;
au.prototype.invDigit = D;
au.prototype.isEven = k;
au.prototype.exp = A;
au.prototype.toString = s;
au.prototype.negate = T;
au.prototype.abs = an;
au.prototype.compareTo = I;
au.prototype.bitLength = w;
au.prototype.mod = P;
au.prototype.modPowInt = ap;
au.ZERO = c(0);
au.ONE = c(1);
var o;
var W;
var ae;
function d(t) {
	W[ae++] ^= t & 255;
	W[ae++] ^= (t >> 8) & 255;
	W[ae++] ^= (t >> 16) & 255;
	W[ae++] ^= (t >> 24) & 255;
	if (ae >= O) {
		ae -= O
	}
}
function V() {
	d(new Date().getTime())
}
if (W == null) {
	W = new Array();
	ae = 0;
	var K;
	
	/* colin block
	if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto && window.crypto.random) {
		var H = window.crypto.random(32);
		for (K = 0; K < H.length; ++K) {
			W[ae++] = H.charCodeAt(K) & 255
		}
	}
	*/
	while (ae < O) {
		K = Math.floor(65536 * Math.random());
		W[ae++] = K >>> 8;
		W[ae++] = K & 255
	}
	ae = 0;
	V()
}
function E() {
	if (o == null) {
		V();
		o = aq();
		o.init(W);
		for (ae = 0; ae < W.length; ++ae) {
			W[ae] = 0
		}
		ae = 0
	}
	return o.next()
}
function ax(z) {
	var t;
	for (t = 0; t < z.length; ++t) {
		z[t] = E()
	}
}
function af() {}
af.prototype.nextBytes = ax;
function m() {
	this.i = 0;
	this.j = 0;
	this.S = new Array()
}
function f(aE) {
	var aD, z, aC;
	for (aD = 0; aD < 256; ++aD) {
		this.S[aD] = aD
	}
	z = 0;
	for (aD = 0; aD < 256; ++aD) {
		z = (z + this.S[aD] + aE[aD % aE.length]) & 255;
		aC = this.S[aD];
		this.S[aD] = this.S[z];
		this.S[z] = aC
	}
	this.i = 0;
	this.j = 0
}
function a() {
	var z;
	this.i = (this.i + 1) & 255;
	this.j = (this.j + this.S[this.i]) & 255;
	z = this.S[this.i];
	this.S[this.i] = this.S[this.j];
	this.S[this.j] = z;
	return this.S[(z + this.S[this.i]) & 255]
}
m.prototype.init = f;
m.prototype.next = a;
function aq() {
	return new m()
}
var O = 256;
function rsa_encrypt(aD, aC, z) {
	aC = "F20CE00BAE5361F8FA3AE9CEFA495362FF7DA1BA628F64A347F0A8C012BF0B254A30CD92ABFFE7A6EE0DC424CB6166F8819EFA5BCCB20EDFB4AD02E412CCF579B1CA711D55B8B0B3AEB60153D5E0693A2A86F3167D7847A0CB8B00004716A9095D9BADC977CBB804DBDCBA6029A9710869A453F27DFDDF83C016D928B3CBF4C7";
	z = "3";
	var t = new N();
	t.setPublic(aC, z);
	return t.encrypt(aD)
};
///RSA相关
//TEA
/*
function TEA() {
	var u = "",
	a = 0,
	h = [],
	z = [],
	A = 0,
	w = 0,
	o = [],
	v = [],
	p = true;
};
function tea_f() {
	return Math.round(Math.random() * 4294967295)
};
function tea_k(E, F, B) {
	if (!B || B > 4) {
		B = 4
	}
	var C = 0;
	for (var D = F; D < F + B; D++) {
		C <<= 8;
		C |= E[D]
	}
	return (C & 4294967295) >>> 0
}
function tea_y(E) {
	if (!E) {
		return ""
	}
	var B = "";
	for (var C = 0; C < E.length; C++) {
		var D = Number(E[C]).toString(16);
		if (D.length == 1) {
			D = "0" + D
		}
		B += D
	}
	return B
};
function tea_m(E) {
	var D, F, C = [],
	B = E.length;
	for (D = 0; D < B; D++) {
		F = E.charCodeAt(D);
		if (F > 0 && F <= 127) {
			C.push(E.charAt(D))
		} else {
			if (F >= 128 && F <= 2047) {
				C.push(String.fromCharCode(192 | ((F >> 6) & 31)), String.fromCharCode(128 | (F & 63)))
			} else {
				if (F >= 2048 && F <= 65535) {
					C.push(String.fromCharCode(224 | ((F >> 12) & 15)), String.fromCharCode(128 | ((F >> 6) & 63)), String.fromCharCode(128 | (F & 63)))
				}
			}
		}
	}
	return C.join("")
};
function tea_strToBytes(E, B) {
	if (!E) {
		return ""
	}
	if (B) {
		E = tea_m(E)
	}
	var D = [];
	for (var C = 0; C < E.length; C++) {
		D[C] = E.charCodeAt(C)
	}
	return tea_y(D)
};
function tea_initkey(F, E) {
	var D = [];
	if (E) {
		for (var C = 0; C < F.length; C++) {
			D[C] = F.charCodeAt(C) & 255
		}
	} else {
		var B = 0;
		for (var C = 0; C < F.length; C += 2) {
			D[B++] = parseInt(F.substr(C, 2), 16)
		}
	}
	return D
};
function tea_b(C, D, B) {
	C[D + 3] = (B >> 0) & 255;
	C[D + 2] = (B >> 8) & 255;
	C[D + 1] = (B >> 16) & 255;
	C[D + 0] = (B >> 24) & 255
}
function tea_l(B) {
	var C = 16;
	var H = tea_k(B, 0, 4);
	var G = tea_k(B, 4, 4);
	var J = tea_k(u, 0, 4);
	var I = tea_k(u, 4, 4);
	var F = tea_k(u, 8, 4);
	var E = tea_k(u, 12, 4);
	var D = 0;
	var K = 2654435769 >>> 0;
	while (C-->0) {
		D += K;
		D = (D & 4294967295) >>> 0;
		H += ((G << 4) + J) ^ (G + D) ^ ((G >>> 5) + I);
		H = (H & 4294967295) >>> 0;
		G += ((H << 4) + F) ^ (H + D) ^ ((H >>> 5) + E);
		G = (G & 4294967295) >>> 0
	}
	var L = new Array(8);
	tea_b(L, 0, H);
	tea_b(L, 4, G);
	return L
}
function tea_r() {
	for (var B = 0; B < 8; B++) {
		if (p) {
			h[B] ^= z[B]
		} else {
			h[B] ^= o[w + B]
		}
	}
	var C = tea_l(h);
	for (var B = 0; B < 8; B++) {
		o[A + B] = C[B] ^ z[B];
		z[B] = h[B]
	}
	w = A;
	A += 8;
	a = 0;
	p = false
};
function tea_j(D) {
	h = new Array(8);
	z = new Array(8);
	A = w = 0;
	p = true;
	a = 0;
	var B = D.length;
	var E = 0;
	a = (B + 10) % 8;
	if (a != 0) {
		a = 8 - a
	}
	o = new Array(B + a + 10);
	h[0] = ((tea_f() & 248) | a) & 255;
	for (var C = 1; C <= a; C++) {
		h[C] = tea_f() & 255
	}
	a++;
	for (var C = 0; C < 8; C++) {
		z[C] = 0
	}
	E = 1;
	while (E <= 2) {
		if (a < 8) {
			h[a++] = tea_f() & 255;
			E++
		}
		if (a == 8) {
			tea_r()
		}
	}
	var C = 0;
	while (B > 0) {
		if (a < 8) {
			h[a++] = D[C++];
			B--
		}
		if (a == 8) {
			tea_r()
		}
	}
	E = 1;
	while (E <= 7) {
		if (a < 8) {
			h[a++] = 0;
			E++
		}
		if (a == 8) {
			tea_r()
		}
	}
	return o
};
var tea_d = {};
tea_d.PADCHAR = "=";
tea_d.ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
tea_d.getbyte = function(D, C) {
	var B = D.charCodeAt(C);
	if (B > 255) {
		throw "INVALID_CHARACTER_ERR: DOM Exception 5"
	}
	return B
};
tea_d.encode = function(F) {
	if (arguments.length != 1) {
		throw "SyntaxError: Not enough arguments"
	}
	var C = tea_d.PADCHAR;
	var H = tea_d.ALPHA;
	var G = tea_d.getbyte;
	var E, I;
	var B = [];
	F = "" + F;
	var D = F.length - F.length % 3;
	if (F.length == 0) {
		return F
	}
	for (E = 0; E < D; E += 3) {
		I = (G(F, E) << 16) | (G(F, E + 1) << 8) | G(F, E + 2);
		B.push(H.charAt(I >> 18));
		B.push(H.charAt((I >> 12) & 63));
		B.push(H.charAt((I >> 6) & 63));
		B.push(H.charAt(I & 63))
	}
	switch (F.length - D) {
	case 1:
		I = G(F, E) << 16;
		B.push(H.charAt(I >> 18) + H.charAt((I >> 12) & 63) + C + C);
		break;
	case 2:
		I = (G(F, E) << 16) | (G(F, E + 1) << 8);
		B.push(H.charAt(I >> 18) + H.charAt((I >> 12) & 63) + H.charAt((I >> 6) & 63) + C);
		break
	}
	return B.join("")
};
function tea_enAsBase64(G, F) {
	var E = tea_initkey(G, F);
	var D = tea_j(E);
	var B = "";
	for (var C = 0; C < D.length; C++) {
		B += String.fromCharCode(D[C])
	}
	return tea_d.encode(B)
};
TEA.prototype.strToBytes = tea_strToBytes;
TEA.prototype.initkey = tea_initkey;
TEA.prototype.enAsBase64 = tea_enAsBase64;
*/
var tea_u = "",
	tea_a = 0,
	tea_h = [],
	tea_z = [],
	tea_A = 0,
	tea_w = 0,
	tea_o = [],
	tea_v = [],
	tea_p = true;
function TEA() {};
function tea_f() {
	return Math.round(Math.random() * 4294967295)
};
function tea_k(E, F, B) {
	if (!B || B > 4) {
		B = 4
	}
	var C = 0;
	for (var D = F; D < F + B; D++) {
		C <<= 8;
		C |= E[D]
	}
	return (C & 4294967295) >>> 0
}
function tea_y(E) {
	if (!E) {
		return ""
	}
	var B = "";
	for (var C = 0; C < E.length; C++) {
		var D = Number(E[C]).toString(16);
		if (D.length == 1) {
			D = "0" + D
		}
		B += D
	}
	return B
};
function tea_m(E) {
	var D, F, C = [],
	B = E.length;
	for (D = 0; D < B; D++) {
		F = E.charCodeAt(D);
		if (F > 0 && F <= 127) {
			C.push(E.charAt(D))
		} else {
			if (F >= 128 && F <= 2047) {
				C.push(String.fromCharCode(192 | ((F >> 6) & 31)), String.fromCharCode(128 | (F & 63)))
			} else {
				if (F >= 2048 && F <= 65535) {
					C.push(String.fromCharCode(224 | ((F >> 12) & 15)), String.fromCharCode(128 | ((F >> 6) & 63)), String.fromCharCode(128 | (F & 63)))
				}
			}
		}
	}
	return C.join("")
};
function tea_strToBytes(E, B) {
	if (!E) {
		return ""
	}
	if (B) {
		E = tea_m(E)
	}
	var D = [];
	for (var C = 0; C < E.length; C++) {
		D[C] = E.charCodeAt(C)
	}
	return tea_y(D)
};
function tea_initkey(F, E) {
	var D = [];
	if (E) {
		for (var C = 0; C < F.length; C++) {
			D[C] = F.charCodeAt(C) & 255
		}
	} else {
		var B = 0;
		for (var C = 0; C < F.length; C += 2) {
			D[B++] = parseInt(F.substr(C, 2), 16)
		}
	}
	return D
};
function tea_b(C, D, B) {
	C[D + 3] = (B >> 0) & 255;
	C[D + 2] = (B >> 8) & 255;
	C[D + 1] = (B >> 16) & 255;
	C[D + 0] = (B >> 24) & 255
}
function tea_l(B) {
	var C = 16;
	var H = tea_k(B, 0, 4);
	var G = tea_k(B, 4, 4);
	var J = tea_k(tea_u, 0, 4);
	var I = tea_k(tea_u, 4, 4);
	var F = tea_k(tea_u, 8, 4);
	var E = tea_k(tea_u, 12, 4);
	var D = 0;
	var K = 2654435769 >>> 0;
	while (C-->0) {
		D += K;
		D = (D & 4294967295) >>> 0;
		H += ((G << 4) + J) ^ (G + D) ^ ((G >>> 5) + I);
		H = (H & 4294967295) >>> 0;
		G += ((H << 4) + F) ^ (H + D) ^ ((H >>> 5) + E);
		G = (G & 4294967295) >>> 0
	}
	var L = new Array(8);
	tea_b(L, 0, H);
	tea_b(L, 4, G);
	return L
}
function tea_r() {
	for (var B = 0; B < 8; B++) {
		if (tea_p) {
			tea_h[B] ^= tea_z[B]
		} else {
			tea_h[B] ^= tea_o[tea_w + B]
		}
	}
	var C = tea_l(tea_h);
	for (var B = 0; B < 8; B++) {
		tea_o[tea_A + B] = C[B] ^ tea_z[B];
		tea_z[B] = tea_h[B]
	}
	tea_w = tea_A;
	tea_A += 8;
	tea_a = 0;
	tea_p = false
};
function tea_j(D) {
	tea_h = new Array(8);
	tea_z = new Array(8);
	tea_A = tea_w = 0;
	tea_p = true;
	tea_a = 0;
	var B = D.length;
	var E = 0;
	tea_a = (B + 10) % 8;
	if (tea_a != 0) {
		tea_a = 8 - tea_a
	}
	tea_o = new Array(B + tea_a + 10);
	tea_h[0] = ((tea_f() & 248) | tea_a) & 255;
	for (var C = 1; C <= tea_a; C++) {
		tea_h[C] = tea_f() & 255
	}
	tea_a++;
	for (var C = 0; C < 8; C++) {
		tea_z[C] = 0
	}
	E = 1;
	while (E <= 2) {
		if (tea_a < 8) {
			tea_h[tea_a++] = tea_f() & 255;
			E++
		}
		if (tea_a == 8) {
			tea_r()
		}
	}
	var C = 0;
	while (B > 0) {
		if (tea_a < 8) {
			tea_h[tea_a++] = D[C++];
			B--
		}
		if (tea_a == 8) {
			tea_r()
		}
	}
	E = 1;
	while (E <= 7) {
		if (tea_a < 8) {
			tea_h[tea_a++] = 0;
			E++
		}
		if (tea_a == 8) {
			tea_r()
		}
	}
	return tea_o
};
var tea_d = {};
tea_d.PADCHAR = "=";
tea_d.ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
tea_d.getbyte = function(D, C) {
	var B = D.charCodeAt(C);
	if (B > 255) {
		throw "INVALID_CHARACTER_ERR: DOM Exception 5"
	}
	return B
};
tea_d.encode = function(F) {
	if (arguments.length != 1) {
		throw "SyntaxError: Not enough arguments"
	}
	var C = tea_d.PADCHAR;
	var H = tea_d.ALPHA;
	var G = tea_d.getbyte;
	var E, I;
	var B = [];
	F = "" + F;
	var D = F.length - F.length % 3;
	if (F.length == 0) {
		return F
	}
	for (E = 0; E < D; E += 3) {
		I = (G(F, E) << 16) | (G(F, E + 1) << 8) | G(F, E + 2);
		B.push(H.charAt(I >> 18));
		B.push(H.charAt((I >> 12) & 63));
		B.push(H.charAt((I >> 6) & 63));
		B.push(H.charAt(I & 63))
	}
	switch (F.length - D) {
	case 1:
		I = G(F, E) << 16;
		B.push(H.charAt(I >> 18) + H.charAt((I >> 12) & 63) + C + C);
		break;
	case 2:
		I = (G(F, E) << 16) | (G(F, E + 1) << 8);
		B.push(H.charAt(I >> 18) + H.charAt((I >> 12) & 63) + H.charAt((I >> 6) & 63) + C);
		break
	}
	return B.join("")
};
function tea_enAsBase64(G, F) {
	var E = tea_initkey(G, F);
	var D = tea_j(E);
	var B = "";
	for (var C = 0; C < D.length; C++) {
		B += String.fromCharCode(D[C])
	}
	return tea_d.encode(B)
};
TEA.prototype.strToBytes = tea_strToBytes;
TEA.prototype.initkey = tea_initkey;
TEA.prototype.enAsBase64 = tea_enAsBase64;
//TEA

//要调用的函数
function myEncrypt(password, salt, vcode, isMd5) {
	//salt = uin2hex(salt); 把账号转换成16进制，传进来直接就是16进制，所以这里不用转了
	vcode = vcode || "";
	password = password || "";
	var md5Pwd = isMd5 ? password: md5(password);
	var h1 = hexchar2bin(md5Pwd);
	var s2 = md5(h1 + salt);
	var rsaH1 = rsa_encrypt(h1);
	var rsaH1Len = (rsaH1.length / 2).toString(16);
	var tea = new TEA();
	var hexVcode = tea.strToBytes(vcode.toUpperCase(), true);
	var vcodeLen = Number(hexVcode.length / 2).toString(16);
	while (vcodeLen.length < 4) {
		vcodeLen = "0" + vcodeLen
	}
	while (rsaH1Len.length < 4) {
		rsaH1Len = "0" + rsaH1Len
	}
	tea_u = tea.initkey(s2);
	var saltPwd = tea.enAsBase64(rsaH1Len + rsaH1 + tea.strToBytes(salt) + vcodeLen + hexVcode);
	tea_u = tea.initkey("");
	/*
	setTimeout(function() {
		__monitor(488358, 1)
	},
	0);
	*/
	return saltPwd.replace(/[\/\+=]/g,
	function(a) {
		return {
			"/": "-",
			"+": "*",
			"=": "_"
		} [a]
	})
	
}
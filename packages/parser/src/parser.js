// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {indentation, descendant, interpolationEnd, unitToken, identifiers, spaces, comments, indentedMixins} from "./tokens"
import {trackIndent} from "./tokens.js"
import {cssHighlighting} from "./highlight"
const spec_identifier = {__proto__:null,not:62, only:62, using:173, as:183, with:187, without:187, hide:203, show:203, from:226, to:228, if:241, through:247, in:253}
const spec_callee = {__proto__:null,url:80, "url-prefix":80, domain:80, regexp:80, lang:94, "nth-child":94, "nth-last-child":94, "nth-of-type":94, "nth-last-of-type":94, dir:94, "host-context":94, selector:166}
const spec_AtKeyword = {__proto__:null,"@import":150, "@include":170, "@mixin":176, "@function":176, "@use":180, "@extend":190, "@at-root":194, "@forward":198, "@media":206, "@charset":210, "@namespace":214, "@keyframes":220, "@supports":232, "@if":236, "@else":238, "@for":244, "@each":250, "@while":256, "@debug":260, "@warn":260, "@error":260, "@return":260}
export const parser = LRParser.deserialize({
  version: 14,
  states: "JlQ`Q+tOOO#cQ+tOOP#jOpOOO#oQ(pO'#CjOOQ#U'#Ci'#CiO%[Q)QO'#FuO%oQ.jO'#CnO&gQ#dO'#DWO'^Q(pO'#CgO'eQ)OO'#DYO'pQ#dO'#DaO'uQ#dO'#DeOOQ#U'#Fu'#FuO'zQ(pO'#FuO(RQ(nO'#DpO%oQ.jO'#DwO%oQ.jO'#ESO%oQ.jO'#EVO%oQ.jO'#EXO(WQ)OO'#E^O(uQ)OO'#E`O%oQ.jO'#EbO)SQ)OO'#EfO%oQ.jO'#EhO)nQ)OO'#EjO)yQ#dO'#EmO*OQ)OO'#EsO*dQ)OO'#FTOOQ&Z'#Ft'#FtOOQ&Y'#FW'#FWO*nQ(nO'#FWQ`Q+tOOO%oQ.jO'#EuO*yQ(nO'#EyO+OQ)OO'#E|O%oQ.jO'#FPO%oQ.jO'#FROOQ&Z'#F_'#F_O+WQ+uO'#F|O+eQ(oO'#F|QOQ#SOOP+yO#SO'#FsPOOO)CAh)CAhOOQ#U'#Cm'#CmOOQ#U,59W,59WOOQ#i'#Cp'#CpO%oQ.jO'#CsO,XQ.wO'#CuO.tQ.^O,59YO%oQ.jO'#CzOOQ#S'#DO'#DOO/VQ(nO'#DTOOQ#i'#Fv'#FvO/[Q(nO'#C}OOQ#U'#DX'#DXOOQ#U,59r,59rO&gQ#dO,59rO/aQ)OO,59tO'pQ#dO,59{O'uQ#dO,5:PO(WQ)OO,5:TO(WQ)OO,5:VO(WQ)OO,5:WO(WQ)OO'#F^O/lQ(nO,59RO/wQ+tO'#DnO0OQ#TO'#DnOOQ&Z,59R,59ROOQ#U'#D['#D[OOQ#S'#D_'#D_OOQ#U,59t,59tO0TQ(nO,59tO0YQ(nO,59tOOQ#U'#Dc'#DcOOQ#U,59{,59{OOQ#S'#Dg'#DgO0_Q9`O,5:PO0gQ.jO,5:[O0qQ.jO,5:cO1jQ.jO,5:nO1wQ.YO,5:qO2YQ.jO,5:sOOQ#U'#Cj'#CjO3RQ(pO,5:xO3`Q(pO,5:zOOQ&Z,5:z,5:zO3gQ)OO,5:zO3lQ.jO,5:|OOQ#S'#Dz'#DzO4[Q)OO'#EPO4cQ(nO'#GOO*OQ)OO'#EOO4wQ(nO'#EQOOQ#S'#GP'#GPO/oQ(nO,5;QO2`Q.YO,5;SOOQ#d'#El'#ElO*nQ(nO,5;UO4|Q)OO,5;UOOQ#S'#Eo'#EoO5UQ(nO,5;XO5ZQ(nO,5;_O5fQ(nO,5;oOOQ&Z'#F}'#F}OOQ&Y,5;r,5;rOOQ&Y-E9U-E9UO1wQ.YO,5;aO5tQ)OO,5;eO5yQ)OO'#GRO6RQ)OO,5;hO1wQ.YO,5;kO2`Q.YO,5;mOOQ&Z-E9]-E9]O6WQ(oO,5<hO6lQ+uO'#FaO6WQ(oO,5<hPOO#S'#FV'#FVP7SO#SO,5<_POOO,5<_,5<_O7bQ.YO,59_OOQ#i,59a,59aO%oQ.jO,59cO%oQ.jO,59hO%oQ.jO'#FZO7pQ#WO1G.tOOQ#k1G.t1G.tO7xQ.oO,59fO:bQ! lO,59oO;_Q.jO'#DPOOQ#i,59i,59iOOQ#U1G/^1G/^OOQ#U1G/`1G/`O0TQ(nO1G/`O0YQ(nO1G/`OOQ#U1G/g1G/gO;iQ9`O1G/kO<SQ(pO1G/oO<vQ(pO1G/qO=jQ(pO1G/rO>^Q(pO,5;xOOQ#S-E9[-E9[OOQ&Z1G.m1G.mO>kQ(nO,5:YO>pQ+uO,5:YO>wQ)OO'#D`O?OQ.jO'#D^OOQ#U1G/k1G/kO%oQ.jO1G/kO?VQ.kO1G/vOOQ#T1G/v1G/vO*nQ(nO1G/}O@SQ+uO'#F}OOQ&Z1G0Y1G0YO/[Q(nO1G0YOOQ&Z1G0]1G0]OOQ&Z1G0_1G0_O/[Q(nO1G0_OBlQ!NUO1G0_OOQ&Z1G0d1G0dOOQ&Z1G0f1G0fOBqQ)OO1G0fOBvQ(nO1G0fOB{Q)OO1G0hOOQ&Z1G0h1G0hOCZQ.jO'#FcOCkQ9`O1G0hOCpQ(nO'#DzOC{Q(nO,5:gODQQ(nO,5:kO*OQ)OO,5:iODYQ)OO'#FbODmQ(nO,5<jOEOQ(nO,5:jO(WQ)OO,5:lOOQ&Z1G0l1G0lOOQ&Z1G0n1G0nOOQ&Z1G0p1G0pO*nQ(nO1G0pOEgQ)OO'#EpOOQ&Z1G0s1G0sOOQ&Z1G0y1G0yOOQ&Z1G1Z1G1ZOEuQ+uO1G0{O%oQ.jO1G1POH_Q)OO'#FgOHjQ)OO,5<mO%oQ.jO1G1SOOQ&Z1G1V1G1VOOQ&Z1G1X1G1XOHrQ(oO1G2SOIWQ+uO,5;{OOQ#T,5;{,5;{OOQ#T-E9_-E9_POO#S-E9T-E9TPOOO1G1y1G1yOOQ#i1G.y1G.yOInQ.oO1G.}OOQ#i1G/S1G/SOLWQ.^O,5;uOOQ#W-E9X-E9XOOQ#k7+$`7+$`OLiQ(nO1G/ZOLnQ.jO'#FXOMxQ.jO'#FyO! aQ.jO'#FvO! hQ(nO,59kOOQ#U7+$z7+$zOOQ#U7+%V7+%VO%oQ.jO7+%VOOQ&Z1G/t1G/tO! mQ#TO1G/tO! rQ(pO'#F{O! |Q(nO,59zO!!RQ.jO'#FzO!!]Q(nO,59xO!!bQ.YO7+%VO!!pQ.kO'#F`O%oQ.jO'#F`O!$aQ.kO7+%bOOQ#T7+%b7+%bOOQ&Z7+%i7+%iO5fQ(nO7+%tO*nQ(nO7+%yO!%TQ)OO7+%yO!%cQ(nO7+&QO*OQ)OO7+&QOOQ#d-E9a-E9aOOQ&Z7+&S7+&SO!%hQ.jO'#GQOOQ#d,5;},5;}OB{Q)OO7+&SO%oQ.jO1G0ROOQ#S1G0V1G0VOOQ#S1G0T1G0TO!&SQ(nO,5;|OOQ#S-E9`-E9`O!&hQ(pO1G0WOOQ&Z7+&[7+&[O!&oQ(vO'#CuO/oQ(nO'#FeO!&zQ)OO,5;[OOQ&Z,5;[,5;[O!'YQ+uO7+&gO!)rQ)OO7+&gO!)}Q.jO7+&kOOQ#d,5<R,5<ROOQ#d-E9e-E9eO1wQ.YO7+&nOOQ#T1G1g1G1gOOQ#i7+$u7+$uOOQ#d-E9V-E9VO!*`Q.jO'#FYO!*mQ(nO,5<eO!*mQ(nO,5<eO%oQ.jO,5<eOOQ#i1G/V1G/VO!*uQ.YO<<HqOOQ&Z7+%`7+%`O!+TQ)OO'#F]O!+_Q(nO,5<gOOQ#U1G/f1G/fO!+gQ.jO'#F[O!+qQ(nO,5<fOOQ#U1G/d1G/dOOQ#U<<Hq<<HqO!+yQ.kO,5;zOOQ#e-E9^-E9^OOQ#T<<H|<<H|OOQ&Z<<I`<<I`OOQ&Z<<Ie<<IeO/[Q(nO<<IeO*OQ)OO<<IlO!-jQ(nO<<IlO!-rQ.jO'#FdO!.VQ)OO,5<lOB{Q)OO<<InOOQ&Z<<In<<InO!.hQ.jO7+%mOOQ#S7+%r7+%rOOQ#d,5<P,5<POOQ#d-E9c-E9cOOQ&Z1G0v1G0vOOQ&Z-E9d-E9dO!)rQ)OO<<JRO%oQ.jO,5<QOOQ&Z<<JR<<JRO%oQ.jO<<JVOOQ&Z<<JY<<JYO!.oQ.jO,5;tO!.|Q.jO,5;tOOQ#S-E9W-E9WO!/TQ(nO1G2PO!/]Q.jO1G2POOQ#UAN>]AN>]O!/gQ(pO,5;wOOQ#S-E9Z-E9ZO!/qQ.jO,5;vOOQ#S-E9Y-E9YO*nQ(nOAN?PO!/{Q(nOAN?WO/oQ(nOAN?WO!0TQ.jO,5<OOOQ#d-E9b-E9bOOQ&ZAN?YAN?YOOQ#S<<IX<<IXP!0oQ)OO'#FfOOQ&ZAN?mAN?mO1wQ.YO1G1lO1wQ.YOAN?qOOQ#S1G1`1G1`O%oQ.jO1G1`O!0tQ(nO7+'kOOQ&ZG24kG24kO/oQ(nOG24rOOQ&ZG24rG24rOOQ&Z7+'W7+'WOOQ&ZG25]G25]O!0|Q.jO7+&zOOQ&ZLD*^LD*^",
  stateData: "!1^~O$eOSVOSUOS$cQQ~OS^OTUOWaOX`O[[O_TOc^OtXO}XO!UYO!YZO!lkO!m_O!w`O!zaO!|bO#RcO#TdO#VeO#ZfO#]gO#_hO#biO#hjO#jpO#nqO#qrO#tsO#vtO$aRO$lVO~O$[$pP~P`O$cyO~Ot^Xt!eXv^X}^X!U^X!Y^X!^^X!a^X!c^X$_^X$b^X$l^X~Ot$iXv$iX}$iX!U$iX!Y$iX!^$iX!a$iX!c$iX$_$iX$b$iX$l$iX~O$a{O!i$iX$d$iXf$iXe$iX~P$gOS!UOTUO_!UOc!UOf!OOh!UOj!UOo!ROx!TO$`!SO$a}O$k!PO~O$a!WO~Ot!ZO}!ZO!U![O!Y!]O!^!^O!a!`O!c!cO$_!_O$b!dO$l!YO~Ov!aO~P&lO!P!jO$`!gO$a!fO~O$a!kO~O$a!mO~Ot!oO~P$gOt!oO~OTUO[[O_TOtXO}XO!UYO!YZO$a!tO$lVO~Of!xO!c!cO$b!dO~P(WOTUOc#POf!{Oo!}O!u#OO$a!zO!c$rP$b$rP~Oj#TOx!TO$a#SO~O$a#VO~OTUOc#POf!{Oo!}O!u#OO$a!zO~O!i$rP$d$rP~P)SO!i#ZO$b#ZO$d#ZO~Oc#_O~Oc#`O#r$uP~O$[$pX!j$pX$^$pX~P`O!i#ZO$b#ZO$d#ZO$[$pX!j$pX$^$pX~OU#hOV#hO$b#jO$e#hO~OR#lOPiXQiXliXmiX$liXTiXciXfiXoiX!iiX!uiX$aiX$biX$diX!ciX!xiX!}iX#PiX#XiXeiXSiX_iXhiXjiXviXxiX!fiX!giX!hiX$`iX$kiX$[iXuiX!WiX#fiX#oiX!jiX$^iX~OP#qOQ#oOl#mOm#mO$l#nO~Of#sO~Of#tO~O!P#yO$`!gO$a!fO~Ov!aO!c!cO$b!dO~O!j$pP~P`O$]$TO~Of$UO~Of$VO~O!W$WO![$XO~O!c!cO$b!dO~P%oOl#mOm#mO$l#nO!i$rP$b$rP$d$rP~P*OOl#mOm#mO!i#ZO$d#ZO$l#nO~O!c!cO!x$_O$b$]O~P1XOl#mOm#mO!c!cO$b!dO$l#nO~O!}$cO#P$bO$b#ZO~P1XOt!ZO}!ZO!U![O!Y!]O!^!^O!a!`O$_!_O$l!YO~O!i#ZO$b#ZO$d#ZO~P2gOf$fO~P&lO#P$gO~O!}$kO#X$jO$b#ZO~P1XOTUOc#POf!{Oo!}O!u#OO~O$a$lO~P3yOm$oOv$pO!c$rX$b$rX!i$rX$d$rX~Of$sO~Oj$wOx!TO~O!c$xO~Om$oO!c!cO$b!dO~O!c!cO!i#ZO$b$]O$d#ZO~O#e$}O~Ov%OO#r$uX~O#r%QO~O!i#ZO$b#ZO$d#ZO$[$pa!j$pa$^$pa~O!i$TX$[$TX$b$TX$d$TX!j$TX$^$TX~P`OU#hOV#hO$b%YO$e#hO~Oe%ZOl#mOm#mO$l#nO~OP%`OQ#oO~Ol#mOm#mO$l#nOPnaQnaTnacnafnaona!ina!una$ana$bna$dna!cna!xna!}na#Pna#XnaenaSna_nahnajnavnaxna!fna!gna!hna$`na$kna$[nauna!Wna#fna#ona!jna$^na~Oj%aOy%aO~OS!UOTUO_!UOf!OOh!UOj!UOo!ROx!TO$`!SO$a}O$k!PO~Oc%dOe$mP~P:jO!W%gO![%hO~Ot!ZO}!ZO!U![O!Y!]O$l!YO~Ov!]i!^!]i!a!]i!c!]i$_!]i$b!]i!i!]i$d!]if!]ie!]i~P;qOv!_i!^!_i!a!_i!c!_i$_!_i$b!_i!i!_i$d!_if!_ie!_i~P;qOv!`i!^!`i!a!`i!c!`i$_!`i$b!`i!i!`i$d!`if!`ie!`i~P;qOv$Qa!c$Qa$b$Qa~P2gO!j%iO~O$^$pP~P`Oe$oP~P(WOe$nP~P%oOl#mOm#mOv%qO!f%sO!g%sO!h%sO$l#nO!i!di$b!di$d!di$[!di!j!di$^!di~P%oO$]$TOS$qXT$qXW$qXX$qX[$qX_$qXc$qXt$qX}$qX!U$qX!Y$qX!l$qX!m$qX!w$qX!z$qX!|$qX#R$qX#T$qX#V$qX#Z$qX#]$qX#_$qX#b$qX#h$qX#j$qX#n$qX#q$qX#t$qX#v$qX$[$qX$a$qX$l$qX!j$qX!i$qX$b$qX$d$qX$^$qX~O#O%wO~O#P%xO~Ot%yO~O!i#ZO#X$jO$b#ZO$d#ZO~O!i$tP#X$tP$b$tP$d$tP~P%oO#W&OO~Oe!nXm!nXt!pX~Ot&PO~Oe&QOm$oO~Ov$UX!c$UX$b$UX!i$UX$d$UX~P*OOv$pO!c$ra$b$ra!i$ra$d$ra~Om$oOv!ra!c!ra$b!ra!i!ra$d!rae!ra~O!j&ZO#e&XO#f&XO$k&WO~O#k&]OS#iiT#iiW#iiX#ii[#ii_#iic#iit#ii}#ii!U#ii!Y#ii!l#ii!m#ii!w#ii!z#ii!|#ii#R#ii#T#ii#V#ii#Z#ii#]#ii#_#ii#b#ii#h#ii#j#ii#n#ii#q#ii#t#ii#v#ii$[#ii$a#ii$l#ii!j#ii!i#ii$b#ii$d#ii$^#ii~Oc&_Ov$ZX#r$ZX~Ov%OO#r$ua~O!i#ZO$b#ZO$d#ZO$[$pi!j$pi$^$pi~O!i$Ta$[$Ta$b$Ta$d$Ta!j$Ta$^$Ta~P`O$l#nOPkiQkilkimkiTkickifkioki!iki!uki$aki$bki$dki!cki!xki!}ki#Pki#XkiekiSki_kihkijkivkixki!fki!gki!hki$`ki$kki$[kiuki!Wki#fki#oki!jki$^ki~Ol#mOm#mO$l#nOP#}aQ#}a~Oe&cO~Ol#mOm#mO$l#nOS#{XT#{X_#{Xc#{Xe#{Xf#{Xh#{Xj#{Xo#{Xu#{Xv#{Xx#{X$`#{X$a#{X$k#{X~Ou&gOv&eOe$mX~P%oOS$jXT$jX_$jXc$jXe$jXf$jXh$jXj$jXl$jXm$jXo$jXu$jXv$jXx$jX$`$jX$a$jX$k$jX$l$jX~Ot&hO~PNVOe&iO~O$^&kO~Ov&lOe$oX~P2gOe&nO~Ov&oOe$nX~P%oOe&qO~Ol#mOm#mO!W&rO$l#nO~Ol#mOm#mO$l#nOS$SXT$SX_$SXc$SXf$SXh$SXj$SXo$SXv$SXx$SX!f$SX!g$SX!h$SX!i$SX$`$SX$a$SX$b$SX$d$SX$k$SX$[$SX!j$SX$^$SX~Ov%qO!f&uO!g&uO!h&uO!i!dq$b!dq$d!dq$[!dq!j!dq$^!dq~P%oO!i#ZO#P&xO$b#ZO$d#ZO~Ot&yO~Ol#mOm#mOv&{O$l#nO!i$tX#X$tX$b$tX$d$tX~Om$oOv$Ua!c$Ua$b$Ua!i$Ua$d$Ua~Oe'QO~P2gOR#lO!ciX$biX~O!j'TO#e&XO#f&XO$k&WO~O#k'VOS#iqT#iqW#iqX#iq[#iq_#iqc#iqt#iq}#iq!U#iq!Y#iq!l#iq!m#iq!w#iq!z#iq!|#iq#R#iq#T#iq#V#iq#Z#iq#]#iq#_#iq#b#iq#h#iq#j#iq#n#iq#q#iq#t#iq#v#iq$[#iq$a#iq$l#iq!j#iq!i#iq$b#iq$d#iq$^#iq~O!c!cO#l'WO$b!dO~Ol#mOm#mO#f'YO#o'YO$l#nO~Oc']Oe#|Xv#|X~P:jOv&eOe$ma~Ol#mOm#mO!W'aO$l#nO~Oe$PXv$PX~P(WOv&lOe$oa~Oe$OXv$OX~P%oOv&oOe$na~Ol#mOm#mO$l#nOS$SaT$Sa_$Sac$Saf$Sah$Saj$Sao$Sav$Sax$Sa!f$Sa!g$Sa!h$Sa!i$Sa$`$Sa$a$Sa$b$Sa$d$Sa$k$Sa$[$Sa!j$Sa$^$Sa~Oe'hOm$oO~Ov$WX!i$WX#X$WX$b$WX$d$WX~P%oOv&{O!i$ta#X$ta$b$ta$d$ta~Oe'lO~P%oOu'qOe#|av#|a~P%oOt'rO~PNVOv&eOe$mi~Ov&eOe$mi~P%oOe$Pav$Pa~P2gOe$Oav$Oa~P%oOe'uOm$oO~Ol#mOm#mO$l#nOv$Wa!i$Wa#X$Wa$b$Wa$d$Wa~O#l'WO~Ov&eOe$mq~Oe#|qv#|q~P%oO$k$ll!al~",
  goto: "7{$vPPPPPPPPPPP$wP%R%fP%R%y%|P'lPP'lP(iP'lPP'lP'l'l)j*gPPP*sPP%R+v%RP+|P,S,Y,`%RP,fP%RP,lP%RP%R%RP,rP.T.gPPPPP$wPP'`'`.q'`'`'`'`P$wPP$wP$wPPPP$wP$wP$wPPP$wP$wP$wP.t$wP.w.zPP$wP$wPPP$wPP$wPP$wP$wP$wP.}/T/Z/y0X0_0e0k0q0}1T1_1e1o1u1{2RPPPPPPPPPPP2X2[2h3_PP5b5e5h5k5t7Q7Z7u7xalOPov!c#f$T%Us[OPcdov!^!_!`!a!c#f$T$U$s%U&lsSOPcdov!^!_!`!a!c#f$T$U$s%U&lR|Tb[cd!^!_!`!a$U$s&l`]OPov!c#f$T%U!t!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$j$}%Q%c%h%m%q%r&P&e&h&o&{'P'W'Y'['`'d'r'ye#Pfjk!p!{!}$o$p%y&y!u!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$j$}%Q%c%h%m%q%r&P&e&h&o&{'P'W'Y'['`'d'r'y!t!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$j$}%Q%c%h%m%q%r&P&e&h&o&{'P'W'Y'['`'d'r'yT&X$x&Y!u!VU_`abegpst!O!R!o#m#n#o#t$V$X$Y$j$}%Q%c%h%m%q%r&P&e&h&o&{'P'W'Y'['`'d'r'yQ#u!VQ%u$_Q%v$bR'f&x!t!UU_`abegpst!O!R!o#m#n#o#t$V$X$Y$j$}%Q%c%h%m%q%r&P&e&h&o&{'P'W'Y'['`'d'r'yQ#ThR$w#UQ!XVR#v!YQ!hXR#w!ZQ#w!jR%f#yQ!iXR#x!ZQ#w!iR%f#xQ!lYR#z![Q!nZR#{!]Q!eWQ!wdQ$R!bQ$Z!oQ$^!qQ$`!rQ$e!vQ$t#QQ$z#XQ${#YQ$|#^Q%R#bQ&v%uQ'R&XQ'X&]Q'Z&aQ'n'VQ'v'hQ'w'oQ'x'pR'z'uSnOoUwP!c$TQ#evQ%V#fR&b%Ua^OPov!c#f$T%UR$m!{R#UhR#WiR$y#WQ#iyR%X#iQoOR#]oQ%c#tQ%m$V^&d%c%m'P'['`'d'yQ'P&PQ'[&eQ'`&hQ'd&oR'y'rQ&f%cU'^&f'_'sQ'_&gR's'`Q#p!QR%_#pQ&p%mR'e&pQ&m%kR'c&mQ!bWR$Q!bUvP!c$TS#dv%UR%U#fQ%r$YR&t%rQ#gwQ%T#eT%W#g%TQ$q!|R&T$qQ$h!yS%z$h&}R&}&OQ&|%|R'j&|Q&Y$xR'S&YQ&[$|R'U&[Q%P#`R&`%PRzQSmOo]uPv!c#f$T%U`WOPov!c#f$T%UQ!ucQ!vdQ#|!^Q#}!_Q$O!`Q$P!aQ%k$UQ&U$sR'b&lQ!QUQ!p_Q!q`Q!raQ!sbQ!yeQ#RgQ#^pQ#bsQ#ctQ#k!OQ#r!RQ$Y!oQ%[#mQ%]#nQ%^#ol%b#t$V%c%m&P&e&h&o'P'['`'d'r'yQ%o$XS%p$Y%rQ%|$jQ&^$}Q&a%QQ&j%hQ&s%qQ'i&{Q'o'WR'p'YR%e#tR%n$VR%l$UQxPQ$S!cR%j$TQ#[nW#fw#e#g%TQ$^!qQ$a!sQ$d!uQ$i!yQ$u#RQ$v#TQ${#YQ%S#cQ%t$[Q%{$hQ&V$wQ&v%uS&w%v%wQ'O&OQ'k&}R't'fQ#QfQ#YkR$[!pU!|fk!pQ#XjQ$n!{Q$r!}Q&R$oQ&S$pQ&z%yR'g&yR%}$jR#ar",
  nodeNames: "⚠ InterpolationEnd InterpolationContinue Unit VariableName InterpolationStart LineComment Comment IndentedMixin IndentedInclude StyleSheet RuleSet UniversalSelector TagSelector TagName NestingSelector SuffixedSelector Suffix Interpolation SassVariableName ValueName ) ( ParenthesizedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp LogicOp UnaryExpression LogicOp NamespacedValue CallExpression Callee ArgList : ... , CallLiteral CallTag ParenthesizedContent ClassSelector ClassName PseudoClassSelector :: PseudoClassName PseudoClassName ArgList PseudoClassName ArgList IdSelector # IdName ] AttributeSelector [ AttributeName MatchOp ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp Block { Declaration PropertyName Important Global Default ; } ImportStatement AtKeyword import KeywordQuery FeatureQuery FeatureName BinaryQuery UnaryQuery ParenthesizedQuery SelectorQuery selector IncludeStatement include Keyword MixinStatement mixin UseStatement use Keyword UseAs Keyword ExtendStatement extend RootStatement at-root ForwardStatement forward ForwardPrefix Keyword MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList Keyword Keyword SupportsStatement supports IfStatement ControlKeyword ControlKeyword Keyword ForStatement ControlKeyword Keyword EachStatement ControlKeyword Keyword WhileStatement ControlKeyword OutputStatement ControlKeyword AtRule Styles",
  maxTerm: 175,
  context: trackIndent,
  nodeProps: [
    ["openedBy", 1,"InterpolationStart",5,"InterpolationEnd",21,"(",72,"{"],
    ["isolate", -3,6,7,26,""],
    ["closedBy", 22,")",65,"}"]
  ],
  propSources: [cssHighlighting],
  skippedNodes: [0,6,7,133],
  repeatNodeCount: 17,
  tokenData: "!(b~RzOq#uqr$mrs0mst2atu9Ouv;kvw;|wx<_xy=|yz>_z{>d{|?P|}Cr}!ODT!O!PGk!P!Q;k!Q![IU![!]JP!]!^J{!^!_K^!_!`Ku!`!aL^!a!b#u!b!cM_!c!}Nw!}#O! r#O#P#u#P#Q!!T#Q#R!!f#R#SNw#S#T#u#T#U!!{#U#cNw#c#d!&O#d#oNw#o#p!'P#p#q!!f#q#r!'b#r#s!'s#s;'S#u;'S;=`!([<%lO#uW#xSOy$Uz;'S$U;'S;=`$g<%lO$UW$ZSyWOy$Uz;'S$U;'S;=`$g<%lO$UW$jP;=`<%l$UY$p[Oy$Uz!_$U!_!`%f!`#W$U#W#X%y#X#Z$U#Z#[)^#[#]$U#]#^,Y#^;'S$U;'S;=`$g<%lO$UY%mSyWlQOy$Uz;'S$U;'S;=`$g<%lO$UY&OUyWOy$Uz#X$U#X#Y&b#Y;'S$U;'S;=`$g<%lO$UY&gUyWOy$Uz#Y$U#Y#Z&y#Z;'S$U;'S;=`$g<%lO$UY'OUyWOy$Uz#T$U#T#U'b#U;'S$U;'S;=`$g<%lO$UY'gUyWOy$Uz#i$U#i#j'y#j;'S$U;'S;=`$g<%lO$UY(OUyWOy$Uz#`$U#`#a(b#a;'S$U;'S;=`$g<%lO$UY(gUyWOy$Uz#h$U#h#i(y#i;'S$U;'S;=`$g<%lO$UY)QS!hQyWOy$Uz;'S$U;'S;=`$g<%lO$UY)cUyWOy$Uz#`$U#`#a)u#a;'S$U;'S;=`$g<%lO$UY)zUyWOy$Uz#c$U#c#d*^#d;'S$U;'S;=`$g<%lO$UY*cUyWOy$Uz#U$U#U#V*u#V;'S$U;'S;=`$g<%lO$UY*zUyWOy$Uz#T$U#T#U+^#U;'S$U;'S;=`$g<%lO$UY+cUyWOy$Uz#`$U#`#a+u#a;'S$U;'S;=`$g<%lO$UY+|S!gQyWOy$Uz;'S$U;'S;=`$g<%lO$UY,_UyWOy$Uz#a$U#a#b,q#b;'S$U;'S;=`$g<%lO$UY,vUyWOy$Uz#d$U#d#e-Y#e;'S$U;'S;=`$g<%lO$UY-_UyWOy$Uz#c$U#c#d-q#d;'S$U;'S;=`$g<%lO$UY-vUyWOy$Uz#f$U#f#g.Y#g;'S$U;'S;=`$g<%lO$UY._UyWOy$Uz#h$U#h#i.q#i;'S$U;'S;=`$g<%lO$UY.vUyWOy$Uz#T$U#T#U/Y#U;'S$U;'S;=`$g<%lO$UY/_UyWOy$Uz#b$U#b#c/q#c;'S$U;'S;=`$g<%lO$UY/vUyWOy$Uz#h$U#h#i0Y#i;'S$U;'S;=`$g<%lO$UY0aS!fQyWOy$Uz;'S$U;'S;=`$g<%lO$U~0pWOY0mZr0mrs1Ys#O0m#O#P1_#P;'S0m;'S;=`2Z<%lO0m~1_Oj~~1bRO;'S0m;'S;=`1k;=`O0m~1nXOY0mZr0mrs1Ys#O0m#O#P1_#P;'S0m;'S;=`2Z;=`<%l0m<%lO0m~2^P;=`<%l0mZ2fY!UPOy$Uz!Q$U!Q![3U![!c$U!c!i3U!i#T$U#T#Z3U#Z;'S$U;'S;=`$g<%lO$UY3ZYyWOy$Uz!Q$U!Q![3y![!c$U!c!i3y!i#T$U#T#Z3y#Z;'S$U;'S;=`$g<%lO$UY4OYyWOy$Uz!Q$U!Q![4n![!c$U!c!i4n!i#T$U#T#Z4n#Z;'S$U;'S;=`$g<%lO$UY4uYhQyWOy$Uz!Q$U!Q![5e![!c$U!c!i5e!i#T$U#T#Z5e#Z;'S$U;'S;=`$g<%lO$UY5lYhQyWOy$Uz!Q$U!Q![6[![!c$U!c!i6[!i#T$U#T#Z6[#Z;'S$U;'S;=`$g<%lO$UY6aYyWOy$Uz!Q$U!Q![7P![!c$U!c!i7P!i#T$U#T#Z7P#Z;'S$U;'S;=`$g<%lO$UY7WYhQyWOy$Uz!Q$U!Q![7v![!c$U!c!i7v!i#T$U#T#Z7v#Z;'S$U;'S;=`$g<%lO$UY7{YyWOy$Uz!Q$U!Q![8k![!c$U!c!i8k!i#T$U#T#Z8k#Z;'S$U;'S;=`$g<%lO$UY8rShQyWOy$Uz;'S$U;'S;=`$g<%lO$U_9R`Oy$Uz}$U}!O:T!O!Q$U!Q![:T![!_$U!_!`;W!`!c$U!c!}:T!}#R$U#R#S:T#S#T$U#T#o:T#o;'S$U;'S;=`$g<%lO$UZ:[^yWcROy$Uz}$U}!O:T!O!Q$U!Q![:T![!c$U!c!}:T!}#R$U#R#S:T#S#T$U#T#o:T#o;'S$U;'S;=`$g<%lO$U[;_S![SyWOy$Uz;'S$U;'S;=`$g<%lO$UY;pSlQOy$Uz;'S$U;'S;=`$g<%lO$UZ<RS_ROy$Uz;'S$U;'S;=`$g<%lO$U~<bWOY<_Zw<_wx1Yx#O<_#O#P<z#P;'S<_;'S;=`=v<%lO<_~<}RO;'S<_;'S;=`=W;=`O<_~=ZXOY<_Zw<_wx1Yx#O<_#O#P<z#P;'S<_;'S;=`=v;=`<%l<_<%lO<_~=yP;=`<%l<_Z>RSfROy$Uz;'S$U;'S;=`$g<%lO$U~>dOe~o>mU[P#O`lQOy$Uz!_$U!_!`;W!`;'S$U;'S;=`$g<%lO$UZ?WWlQ!aPOy$Uz!O$U!O!P?p!P!Q$U!Q![Bu![;'S$U;'S;=`$g<%lO$UZ?uUyWOy$Uz!Q$U!Q![@X![;'S$U;'S;=`$g<%lO$UZ@`YyW$kROy$Uz!Q$U!Q![@X![!g$U!g!hAO!h#X$U#X#YAO#Y;'S$U;'S;=`$g<%lO$UZATYyWOy$Uz{$U{|As|}$U}!OAs!O!Q$U!Q![B[![;'S$U;'S;=`$g<%lO$UZAxUyWOy$Uz!Q$U!Q![B[![;'S$U;'S;=`$g<%lO$UZBcUyW$kROy$Uz!Q$U!Q![B[![;'S$U;'S;=`$g<%lO$UZB|[yW$kROy$Uz!O$U!O!P@X!P!Q$U!Q![Bu![!g$U!g!hAO!h#X$U#X#YAO#Y;'S$U;'S;=`$g<%lO$UZCwSvROy$Uz;'S$U;'S;=`$g<%lO$UoD[_#O`lQOy$Uz}$U}!OEZ!O!P?p!P!Q$U!Q![Bu![!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#oFn#o;'S$U;'S;=`$g<%lO$UlEb]yW#O`Oy$Uz{FZ{}$U}!OEZ!O!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#oFn#o;'S$U;'S;=`$g<%lO$U[FbS#WSyWOy$Uz;'S$U;'S;=`$g<%lO$UlFu[yW#O`Oy$Uz}$U}!OEZ!O!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#oFn#o;'S$U;'S;=`$g<%lO$UZGpW$lROy$Uz!O$U!O!PHY!P!Q$U!Q![@X![;'S$U;'S;=`$g<%lO$UYH_UyWOy$Uz!O$U!O!PHq!P;'S$U;'S;=`$g<%lO$UYHxSuQyWOy$Uz;'S$U;'S;=`$g<%lO$UZIZ[$kROy$Uz!O$U!O!P@X!P!Q$U!Q![Bu![!g$U!g!hAO!h#X$U#X#YAO#Y;'S$U;'S;=`$g<%lO$UZJUUtROy$Uz![$U![!]Jh!];'S$U;'S;=`$g<%lO$UXJoS}PyWOy$Uz;'S$U;'S;=`$g<%lO$UZKQS!iROy$Uz;'S$U;'S;=`$g<%lO$UYKcUlQOy$Uz!_$U!_!`%f!`;'S$U;'S;=`$g<%lO$U^KzU![SOy$Uz!_$U!_!`%f!`;'S$U;'S;=`$g<%lO$UZLeV!^PlQOy$Uz!_$U!_!`%f!`!aLz!a;'S$U;'S;=`$g<%lO$UXMRS!^PyWOy$Uz;'S$U;'S;=`$g<%lO$UXMbWOy$Uz!c$U!c!}Mz!}#T$U#T#oMz#o;'S$U;'S;=`$g<%lO$UXNR[!lPyWOy$Uz}$U}!OMz!O!Q$U!Q![Mz![!c$U!c!}Mz!}#T$U#T#oMz#o;'S$U;'S;=`$g<%lO$UlN|[#O`Oy$Uz}$U}!OEZ!O!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#oFn#o;'S$U;'S;=`$g<%lO$UX! wS!YPOy$Uz;'S$U;'S;=`$g<%lO$U^!!YS!WUOy$Uz;'S$U;'S;=`$g<%lO$U[!!iUOy$Uz!_$U!_!`;W!`;'S$U;'S;=`$g<%lO$Uo!#Q^#O`Oy$Uz}$U}!OEZ!O!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#bFn#b#c!#|#c#oFn#o;'S$U;'S;=`$g<%lO$Uo!$T^yW#O`Oy$Uz}$U}!OEZ!O!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#WFn#W#X!%P#X#oFn#o;'S$U;'S;=`$g<%lO$Uo!%Y[mRyW#O`Oy$Uz}$U}!OEZ!O!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#oFn#o;'S$U;'S;=`$g<%lO$Uo!&T^#O`Oy$Uz}$U}!OEZ!O!c$U!c!}Fn!}#R$U#R#SFn#S#T$U#T#fFn#f#g!%P#g#oFn#o;'S$U;'S;=`$g<%lO$UZ!'US!cROy$Uz;'S$U;'S;=`$g<%lO$UZ!'gS!jROy$Uz;'S$U;'S;=`$g<%lO$U]!'xU!aPOy$Uz!_$U!_!`;W!`;'S$U;'S;=`$g<%lO$UW!(_P;=`<%l#u",
  tokenizers: [indentation, descendant, interpolationEnd, unitToken, identifiers, spaces, comments, indentedMixins, 0, 1, 2, 3, 4],
  topRules: {"StyleSheet":[0,10],"Styles":[1,132]},
  dialects: {indented: 0},
  specialized: [{term: 155, get: (value) => spec_identifier[value] || -1},{term: 154, get: (value) => spec_callee[value] || -1},{term: 74, get: (value) => spec_AtKeyword[value] || -1}],
  tokenPrec: 2860
})
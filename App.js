import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, SafeAreaView, Linking, Switch } from 'react-native';

const C = { bg: '#F4F7F3', green: '#0E8A4F', dark: '#14231A', mute: '#5B6B60', line: '#DDE5DB', pale: '#E7F1EA', yellow: '#F2B01E' };
const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const VEHICLES = [
  { id: 'auto', name: 'অটো', ic: '🛺', min: 20, rate: 10 },
  { id: 'cng', name: 'সিএনজি', ic: '🚐', min: 40, rate: 14 },
  { id: 'bike', name: 'মোটরবাইক', ic: '🏍️', min: 30, rate: 9 },
];
const PLACES = ['চৌমুহনী বাজার', 'রামপুর বাজার', 'উপজেলা স্বাস্থ্য কমপ্লেক্স', 'বাসস্ট্যান্ড'];
const TIPS = [{ n: 'চিপস', t: 10 }, { n: 'ড্রিংকস', t: 20 }, { n: 'আইসক্রিম', t: 30 }, { n: 'বিরিয়ানি', t: 50 }];
const DRIVERS = [
  { name: 'রহিম উদ্দিন', no: 'লক্ষ্মীপুর-১২৩৪', r: 4.6, c: 82, d: '০.৮ কিমি' },
  { name: 'করিম মিয়া', no: 'ফরিদগঞ্জ-৫৬৭৮', r: 4.2, c: 31, d: '১.৫ কিমি' },
  { name: 'সুমন হোসেন', no: 'রায়পুর-৯০১২', r: 3.8, c: 12, d: '২.১ কিমি' },
];
const TABS = [['ride', '🧭', 'রাইড'], ['hist', '🕘', 'ইতিহাস'], ['safe', '🛡️', 'সুরক্ষা'], ['prof', '👤', 'প্রোফাইল']];

const Btn = ({ t, onPress, kind, disabled }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={[s.btn, kind === 'y' && { backgroundColor: C.yellow }, disabled && { opacity: 0.4 }]}>
    <Text style={[s.btnT, kind === 'y' && { color: C.dark }]}>{t}</Text>
  </TouchableOpacity>
);
const DT = [['dr', '🧭', 'রাইড'], ['de', '💰', 'আয়'], ['dp', '👤', 'প্রোফাইল']];
const Page = ({ title, back, go, children, tab, setTab, tabs = TABS }) => (
  <SafeAreaView style={s.wrap}>
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
      {back && <TouchableOpacity onPress={() => go(back)}><Text style={s.back}>‹ পেছনে</Text></TouchableOpacity>}
      {title && <Text style={s.h1}>{title}</Text>}
      {children}
    </ScrollView>
    {tab && (
      <View style={s.tabs}>
        {tabs.map(([k, ic, nm]) => (
          <TouchableOpacity key={k} style={[s.tab, tab === k && { backgroundColor: C.pale }]} onPress={() => setTab(k)}>
            <Text style={{ fontSize: 20 }}>{ic}</Text>
            <Text style={[s.tabT, tab === k && { color: C.green, fontWeight: '700' }]}>{nm}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </SafeAreaView>
);

export default function App() {
  const [scr, setScr] = useState('home');
  const [tab, setTab] = useState('ride');
  const [taps, setTaps] = useState(0);
  const [adminPw, setAdminPw] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [veh, setVeh] = useState(VEHICLES[0]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fare, setFare] = useState(0);
  const [tip, setTip] = useState(0);
  const [pick, setPick] = useState(null);
  const [left, setLeft] = useState(40);
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [code, setCode] = useState('');
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [hist, setHist] = useState([]);
  const [dPhone, setDPhone] = useState('');
  const [dPass, setDPass] = useState('');
  const [dName, setDName] = useState('');
  const [dVeh, setDVeh] = useState('');
  const [dNo, setDNo] = useState('');
  const [dAreas, setDAreas] = useState([]);
  const [dOnline, setDOnline] = useState(false);
  const [dTab, setDTab] = useState('dr');
  const [dBal, setDBal] = useState(100);
  const [txn, setTxn] = useState('');
  const [amt, setAmt] = useState('');
  const DREQ = { name: 'আয়েশা বেগম', r: 4.5, from: 'চৌমুহনী বাজার', to: 'উপজেলা স্বাস্থ্য কমপ্লেক্স', fare: 60 };
  const comm = Math.ceil(DREQ.fare * 0.08);

  const km = from && to ? 2 + ((from.length + to.length) % 6) : 0;
  const base = Math.max(veh.min, km * veh.rate);
  useEffect(() => { setFare(base); }, [veh, from, to]);
  useEffect(() => {
    if (scr !== 'wait') return;
    setLeft(40);
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [scr]);
  const logoTap = () => { const n = taps + 1; setTaps(n); if (n >= 5) { setTaps(0); setScr('adminPw'); } };
  const P = { go: setScr };

  if (scr === 'home') return (
    <SafeAreaView style={[s.wrap, { justifyContent: 'center', padding: 24 }]}>
      <TouchableOpacity onPress={logoTap} activeOpacity={1} style={s.logo}><Text style={{ fontSize: 54 }}>🛺</Text></TouchableOpacity>
      <Text style={s.brand}>গ্রামের গাড়ি</Text>
      <Text style={s.sub}>সহজ ও বিশ্বস্ত গ্রামীণ রাইড</Text>
      <View style={{ height: 40 }} />
      <Btn t="গাড়ি খুঁজুন" onPress={() => setScr('login')} />
      <Btn t="গাড়ি চালান" kind="y" onPress={() => setScr('dLogin')} />
    </SafeAreaView>
  );
  if (scr === 'adminPw') return (
    <Page {...P} title="অ্যাডমিন" back="home">
      <TextInput style={s.in} placeholder="পাসওয়ার্ড" secureTextEntry value={adminPw} onChangeText={setAdminPw} />
      <Btn t="ঢুকুন" onPress={() => (adminPw === '1234' ? setScr('admin') : Alert.alert('ভুল পাসওয়ার্ড', 'আবার চেষ্টা করুন।'))} />
    </Page>
  );
  if (scr === 'admin') return <Page {...P} title="অ্যাডমিন প্যানেল" back="home"><Text style={s.p}>এই অংশ পরের ধাপে বানানো হবে। ডেমো পাসওয়ার্ড অ্যাপ ছাড়ার আগে অবশ্যই বদলাতে হবে।</Text></Page>;
  if (scr === 'login') return (
    <Page {...P} title="আপনার নাম্বার দিন" back="home">
      <TextInput style={s.in} placeholder="01XXXXXXXXX" keyboardType="phone-pad" maxLength={11} value={phone} onChangeText={setPhone} />
      <Btn t="ওটিপি পাঠান" disabled={phone.length !== 11} onPress={() => setScr('otp')} />
    </Page>
  );
  if (scr === 'otp') return (
    <Page {...P} title="ওটিপি লিখুন" back="login">
      <Text style={s.p}>{phone} নাম্বারে ৪ সংখ্যার কোড গেছে (ডেমোতে যেকোনো ৪ সংখ্যা)।</Text>
      <TextInput style={s.in} keyboardType="number-pad" maxLength={4} value={otp} onChangeText={setOtp} />
      <Btn t="যাচাই করুন" disabled={otp.length !== 4} onPress={() => setScr(name ? 'main' : 'profile')} />
    </Page>
  );
  if (scr === 'profile') return (
    <Page {...P} title="প্রোফাইল তৈরি করুন">
      <Text style={s.p}>মোবাইল নাম্বার: {phone}</Text>
      <TextInput style={s.in} placeholder="আপনার নাম" value={name} onChangeText={setName} />
      <Text style={s.h2}>আপনার এলাকা</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {['হাইমচর', 'ফরিদগঞ্জ', 'রায়পুর', 'লক্ষ্মীপুর'].map((a) => (
          <TouchableOpacity key={a} onPress={() => setArea(a)} style={[s.chip, area === a && { backgroundColor: C.green }]}>
            <Text style={{ color: area === a ? '#fff' : C.dark }}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={s.card} onPress={() => Alert.alert('শীঘ্রই আসছে', 'ছবি তোলার সুবিধা পরের ধাপে আসবে।')}><Text style={s.cardT}>📷 প্রোফাইল ছবি বেছে নিন</Text></TouchableOpacity>
      <Btn t="প্রোফাইল তৈরি করুন" disabled={!name.trim() || !area} onPress={() => setScr('main')} />
    </Page>
  );

  if (scr === 'dLogin') return (
    <Page {...P} title="চালক লগইন" back="home">
      <TextInput style={s.in} placeholder="মোবাইল নাম্বার" keyboardType="phone-pad" maxLength={11} value={dPhone} onChangeText={setDPhone} />
      <TextInput style={s.in} placeholder="পাসওয়ার্ড" secureTextEntry value={dPass} onChangeText={setDPass} />
      <Btn t="লগইন" onPress={() => (dName ? setScr('dHome') : Alert.alert('অ্যাকাউন্ট নেই', 'আগে নতুন অ্যাকাউন্ট খুলুন।'))} />
      <TouchableOpacity onPress={() => Alert.alert('শীঘ্রই আসছে', 'ওটিপি দিয়ে নতুন পাসওয়ার্ড পরের ধাপে আসবে।')}><Text style={[s.back, { textAlign: 'center' }]}>পাসওয়ার্ড ভুলে গেছি</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setScr('dReg')}><Text style={[s.back, { textAlign: 'center', fontWeight: '700' }]}>নতুন অ্যাকাউন্ট খুলুন</Text></TouchableOpacity>
    </Page>
  );
  if (scr === 'dReg') return (
    <Page {...P} title="চালক রেজিস্ট্রেশন" back="dLogin">
      <TextInput style={s.in} placeholder="পুরো নাম (এনআইডির মতো)" value={dName} onChangeText={setDName} />
      <TextInput style={s.in} placeholder="মোবাইল নাম্বার (এনআইডিতে নিবন্ধিত)" keyboardType="phone-pad" maxLength={11} value={dPhone} onChangeText={setDPhone} />
      <TextInput style={s.in} placeholder="জন্মতারিখ (দিন/মাস/বছর)" />
      {['এনআইডির সামনের ছবি', 'এনআইডির পেছনের ছবি', 'এখনকার সেলফি (সরাসরি ক্যামেরা)', 'গাড়ির দুটি ছবি'].map((x) => (
        <TouchableOpacity key={x} style={s.card} onPress={() => Alert.alert('শীঘ্রই আসছে', 'ছবি তোলা পরের ধাপে আসবে।')}><Text style={s.cardT}>📷 {x}</Text></TouchableOpacity>
      ))}
      <Text style={s.h2}>গাড়ির ধরন</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {VEHICLES.map((v) => (<TouchableOpacity key={v.id} onPress={() => setDVeh(v.name)} style={[s.chip, dVeh === v.name && { backgroundColor: C.green }]}><Text style={{ color: dVeh === v.name ? '#fff' : C.dark }}>{v.name}</Text></TouchableOpacity>))}
      </View>
      <TextInput style={s.in} placeholder="গাড়ির নাম্বার" value={dNo} onChangeText={setDNo} />
      <Text style={s.h2}>কোন উপজেলায় চালাবেন</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {['হাইমচর', 'ফরিদগঞ্জ', 'রায়পুর', 'লক্ষ্মীপুর'].map((a) => (<TouchableOpacity key={a} onPress={() => setDAreas(dAreas.includes(a) ? dAreas.filter((x) => x !== a) : [...dAreas, a])} style={[s.chip, dAreas.includes(a) && { backgroundColor: C.green }]}><Text style={{ color: dAreas.includes(a) ? '#fff' : C.dark }}>{a}</Text></TouchableOpacity>))}
      </View>
      <TextInput style={s.in} placeholder="পাসওয়ার্ড বানান" secureTextEntry value={dPass} onChangeText={setDPass} />
      <Btn t="জমা দিন" disabled={!dName.trim() || dPhone.length !== 11 || !dVeh || !dNo || dAreas.length === 0 || dPass.length < 6} onPress={() => setScr('dWait')} />
    </Page>
  );
  if (scr === 'dWait') return (
    <Page {...P} title="অপেক্ষা করুন">
      <Text style={s.p}>আপনার আবেদন জমা হয়েছে। বারো ঘণ্টা অপেক্ষা করুন, অ্যাডমিনের অনুমোদনের অপেক্ষায়।</Text>
      <Btn t="ডেমো: অনুমোদন হলো (১০০ টাকা উপহার)" kind="y" onPress={() => { setDBal(100); setScr('dHome'); }} />
    </Page>
  );
  if (scr === 'dWallet') return (
    <Page {...P} title="ওয়ালেট" back="dHome">
      <Text style={[s.fare, { marginHorizontal: 0 }]}>ব্যালেন্স ৳{bn(dBal)}</Text>
      <Btn t="বিকাশ দিয়ে রিচার্জ" onPress={() => setScr('dRecharge')} />
      <Text style={s.p}>কাটাকাটির তালিকা পরের ধাপে আসবে।</Text>
    </Page>
  );
  if (scr === 'dRecharge') return (
    <Page {...P} title="রিচার্জ" back="dWallet">
      <View style={s.map}><Text style={s.p}>বিকাশের কিউআর কোড এখানে আসবে</Text></View>
      <Text style={s.p}>বিকাশ নাম্বার: 01XXXXXXXXX</Text>
      <Btn t="নাম্বার কপি" kind="y" onPress={() => Alert.alert('কপি হয়েছে (ডেমো)')} />
      <Text style={s.h2}>ট্রানজেকশনের প্রমাণ</Text>
      <TextInput style={s.in} placeholder="ট্রানজেকশন আইডি" value={txn} onChangeText={setTxn} />
      <TextInput style={s.in} placeholder="কত টাকা পাঠিয়েছেন" keyboardType="number-pad" value={amt} onChangeText={setAmt} />
      <Btn t="জমা দিন" disabled={!txn || !amt} onPress={() => { Alert.alert('জমা হয়েছে', 'অ্যাডমিন মিলিয়ে দেখলে টাকা যোগ হবে। এখন অবস্থা: অপেক্ষায়।'); setTxn(''); setAmt(''); setScr('dWallet'); }} />
    </Page>
  );
  if (scr === 'dHome') return (
    <Page {...P} tab={dTab} setTab={setDTab} tabs={DT}>
      <View style={[s.row, { justifyContent: 'space-between' }]}>
        <View style={s.row}><Switch value={dOnline} onValueChange={setDOnline} /><Text style={[s.cardT, { marginLeft: 8 }]}>{dOnline ? 'অনলাইন' : 'অফলাইন'}</Text></View>
        <TouchableOpacity onPress={() => setScr('dWallet')} style={s.chip}><Text style={{ color: C.dark, fontWeight: '700' }}>👛 ৳{bn(dBal)}</Text></TouchableOpacity>
      </View>
      {dTab === 'dr' && !dOnline && <Text style={s.p}>অনলাইন করলে যাত্রীরা আপনাকে দেখতে পাবে ও অনুরোধ পাঠাতে পারবে।</Text>}
      {dTab === 'dr' && dOnline && (
        <View style={s.card}>
          <Text style={s.p}>ডেমো অনুরোধ (৪০ সেকেন্ডের মধ্যে সাড়া দিন)</Text>
          <Text style={s.cardT}>{DREQ.name}  ★ {bn(DREQ.r)}</Text>
          <Text style={s.p}>📍 {DREQ.from}</Text>
          <Text style={s.p}>🧭 {DREQ.to}</Text>
          <Text style={s.fare}>৳{bn(DREQ.fare)}</Text>
          <Text style={s.p}>কমিশন ৳{bn(comm)} ওয়ালেট থেকে কাটা যাবে।</Text>
          <Btn t="নেব" onPress={() => (dBal < comm ? Alert.alert('ওয়ালেটে টাকা কম', 'বিকাশে রিচার্জ করুন।') : Alert.alert('রাইড নেওয়া হলো (ডেমো)', 'পরের ধাপে যাত্রীর কাছে যাওয়ার পাতা আসবে।'))} />
          <Btn t="পাল্টা ভাড়া ৳৭০ (একবারই)" kind="y" onPress={() => Alert.alert('পাঠানো হয়েছে (ডেমো)')} />
        </View>
      )}
      {dTab === 'de' && <Text style={s.p}>আয়ের হিসাব এখানে আসবে: আজ, সপ্তাহ, মাস আর প্রতিটা রাইডের তালিকা।</Text>}
      {dTab === 'dp' && <View><Text style={s.h1}>{dName}</Text><Text style={s.p}>{dPhone}  ·  {dVeh}  ·  {dNo}</Text><Btn t="অ্যাপের শুরুতে ফিরুন" onPress={() => setScr('home')} /></View>}
    </Page>
  );

  if (scr === 'main') {
    const T = { ...P, tab, setTab };
    if (tab === 'hist') return (
      <Page {...T}>
        <Text style={s.h1}>ইতিহাস</Text>
        {hist.length === 0 && <Text style={s.p}>এখনো কোনো রাইড নেই। প্রথম রাইডের পর এখানে দেখা যাবে।</Text>}
        {hist.map((h, i) => (
          <View key={i} style={s.card}>
            <Text style={s.cardT}>{h.from} → {h.to}</Text>
            <Text style={s.p}>{h.veh} · {h.driver} · {bn(h.fare)} টাকা · ★ {bn(h.stars)}</Text>
          </View>
        ))}
      </Page>
    );
    if (tab === 'safe') return (
      <Page {...T}>
        <Text style={s.h1}>সুরক্ষা</Text>
        <TouchableOpacity style={s.card} onPress={() => Linking.openURL('tel:999')}><Text style={s.cardT}>📞 জাতীয় জরুরি হেল্পলাইন ৯৯৯</Text></TouchableOpacity>
        <TouchableOpacity style={s.card} onPress={() => Alert.alert('শীঘ্রই আসছে', 'পরিবারের জরুরি নাম্বার যোগ করার সুবিধা পরে আসবে।')}><Text style={s.cardT}>👨‍👩‍👧 পরিবারের জরুরি নাম্বার</Text></TouchableOpacity>
        <TouchableOpacity style={s.card} onPress={() => Alert.alert('শীঘ্রই আসছে', 'অ্যাডমিনের নাম্বার পরে বসবে।')}><Text style={s.cardT}>💬 অ্যাডমিনকে মেসেজ বা কল</Text></TouchableOpacity>
      </Page>
    );
    if (tab === 'prof') return (
      <Page {...T}>
        <Text style={s.h1}>প্রোফাইল</Text>
        <Text style={s.p}>মোবাইল: {phone}  ·  এলাকা: {area}</Text>
        <Text style={s.p}>নাম বদলান (শুধু নাম ও ছবি বদলানো যায়, রাইডের ইতিহাস মোছা যায় না)</Text>
        <TextInput style={s.in} value={name} onChangeText={setName} />
      </Page>
    );
    return (
      <Page {...T}>
        <Text style={s.brand2}>গ্রামের গাড়ি</Text>
        <Text style={[s.sub, { textAlign: 'center' }]}>সহজ ও বিশ্বস্ত গ্রামীণ রাইড</Text>
        <Text style={s.h2}>গাড়ি পছন্দ করুন</Text>
        <View style={s.grid}>
          {VEHICLES.map((v) => (
            <TouchableOpacity key={v.id} style={[s.vcard, veh.id === v.id && s.vsel]} onPress={() => setVeh(v)}>
              <View style={s.vic}><Text style={{ fontSize: 24 }}>{v.ic}</Text></View>
              {veh.id === v.id && <Text style={s.tick}>✓</Text>}
              <Text style={s.cardT}>{v.name}</Text>
              <Text style={s.min}>শুরু ৳{bn(v.min)} থেকে</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.h2}>কোথা থেকে কোথায় যাবেন?</Text>
        <View style={s.card}>
          <TextInput style={s.in2} placeholder="📍 শুরুর স্থান (যেমন: চৌমুহনী বাজার)" value={from} onChangeText={setFrom} />
          <TouchableOpacity onPress={() => setFrom('আমার বর্তমান অবস্থান')} style={[s.chip, { alignSelf: 'flex-start' }]}><Text style={{ color: C.green }}>📍 আমার বর্তমান অবস্থান</Text></TouchableOpacity>
          <TextInput style={s.in2} placeholder="🧭 গন্তব্য স্থল" value={to} onChangeText={setTo} />
        </View>
        <Btn t="→  ভাড়া নির্ধারণে যান" onPress={() => (!from || !to ? Alert.alert('আগে লিখুন', !from ? 'শুরুর স্থান লিখুন বা "আমার বর্তমান অবস্থান" চাপুন।' : 'গন্তব্য লিখুন বা নিচের পরিচিত স্থান বেছে নিন।') : setScr('fare'))} />
        <Text style={s.p}>পরিচিত স্থানসমূহ থেকে গন্তব্য বেছে নিন:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {PLACES.map((x) => (
            <TouchableOpacity key={x} onPress={() => setTo(x)} style={[s.chip, to === x && { backgroundColor: C.dark }]}>
              <Text style={{ color: to === x ? '#fff' : C.dark }}>{x}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Page>
    );
  }

  if (scr === 'fare') return (
    <Page {...P} title="ভাড়া নির্ধারণ" back="main">
      <View style={s.card}>
        <Text style={s.p}>{veh.name}: {from} থেকে {to}</Text>
        <Text style={s.p}>দূরত্ব প্রায় {bn(km)} কিমি, অ্যাপের ভাড়া {bn(base)} টাকা</Text>
        <View style={s.row}>
          <TouchableOpacity style={s.pm} onPress={() => setFare(Math.max(veh.min, fare - 5))}><Text style={s.pmT}>−</Text></TouchableOpacity>
          <Text style={s.fare}>{bn(fare)} টাকা</Text>
          <TouchableOpacity style={s.pm} onPress={() => setFare(Math.min(base, fare + 5))}><Text style={s.pmT}>+</Text></TouchableOpacity>
        </View>
        <Text style={s.p}>{veh.name}ের সর্বনিম্ন {bn(veh.min)} টাকার নিচে নামানো যাবে না।</Text>
        <Text style={[s.p, { marginTop: 12 }]}>চালকের জন্য ছোট উপহার (ঐচ্ছিক)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {TIPS.map((x) => (
            <TouchableOpacity key={x.n} onPress={() => setTip(tip === x.t ? 0 : x.t)} style={[s.chip, tip === x.t && { backgroundColor: C.yellow }]}>
              <Text style={{ color: C.dark }}>{x.n} {bn(x.t)}৳</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[s.fare, { marginTop: 12, marginHorizontal: 0 }]}>মোট {bn(fare + tip)} টাকা</Text>
      </View>
      <Btn t="গাড়ি খুঁজুন" onPress={() => setScr('drivers')} />
    </Page>
  );
  if (scr === 'drivers') return (
    <Page {...P} title="কাছের চালক" back="fare">
      {DRIVERS.map((d) => (
        <TouchableOpacity key={d.no} style={s.card} onPress={() => { setPick(d); setScr('wait'); }}>
          <Text style={s.cardT}>{d.name}</Text>
          <Text style={s.p}>{d.no}  ·  {d.d}</Text>
          <Text style={s.p}>★ {bn(d.r)}  ({bn(d.c)} জন রেটিং দিয়েছেন)</Text>
        </TouchableOpacity>
      ))}
    </Page>
  );
  if (scr === 'wait') return (
    <Page {...P} title="চালকের উত্তরের অপেক্ষায়" back="drivers">
      <Text style={s.p}>{pick.name}-কে {bn(fare + tip)} টাকার অনুরোধ পাঠানো হয়েছে।</Text>
      <Text style={[s.fare, { fontSize: 56, textAlign: 'center', marginVertical: 30 }]}>{bn(left)} সেকেন্ড</Text>
      <Btn t="ডেমো: চালক রাজি হলেন" kind="y" onPress={() => { setCode(String(1000 + Math.floor(Math.random() * 9000))); setScr('matched'); }} />
      {left === 0 && <Btn t="অন্য চালক বেছে নিন" onPress={() => setScr('drivers')} />}
    </Page>
  );
  if (scr === 'matched') return (
    <Page {...P} title="রাইড পাকা হয়েছে">
      <View style={s.card}>
        <Text style={s.cardT}>{pick.name}</Text>
        <Text style={s.p}>{pick.no}  ·  {pick.d} দূরে</Text>
        <Text style={s.p}>ভাড়া {bn(fare + tip)} টাকা (নগদে)</Text>
      </View>
      <Text style={s.p}>চালক পৌঁছালে তাকে এই কোডটা বলুন:</Text>
      <Text style={s.code}>{bn(code)}</Text>
      <Btn t="📞 চালককে ফোন করুন" onPress={() => Linking.openURL('tel:01700000000')} />
      <Btn t="💬 মেসেজ (শীঘ্রই আসছে)" kind="y" onPress={() => Alert.alert('শীঘ্রই আসছে', 'অ্যাপের ভেতরের চ্যাট পরে আসবে।')} />
      <Btn t="ডেমো: যাত্রা শুরু হলো" onPress={() => setScr('ride')} />
      <TouchableOpacity onPress={() => Alert.alert('রাইড বাতিল', 'বাতিল করলে ১৫ টাকা বকেয়া জমবে।', [{ text: 'না' }, { text: 'বাতিল করুন', onPress: () => setScr('main') }])}><Text style={[s.back, { textAlign: 'center', color: '#B3261E' }]}>রাইড বাতিল করুন</Text></TouchableOpacity>
    </Page>
  );
  if (scr === 'ride') return (
    <Page {...P} title="যাত্রা চলছে">
      <View style={s.card}>
        <Text style={s.p}>📍 {from}</Text>
        <Text style={s.p}>🧭 {to}</Text>
        <Text style={s.p}>চালক: {pick.name}</Text>
      </View>
      <View style={s.map}><Text style={s.p}>লাইভ মানচিত্র এখানে আসবে</Text></View>
      <Btn t="🛡️ সুরক্ষা" kind="y" onPress={() => Alert.alert('সুরক্ষা', 'জরুরি হেল্পলাইন ৯৯৯, পরিবারকে কল ও অ্যাডমিনকে মেসেজ এখানে আসবে।', [{ text: 'বন্ধ' }, { text: '৯৯৯ এ কল', onPress: () => Linking.openURL('tel:999') }])} />
      <Btn t="আমি গন্তব্যে পৌঁছেছি" onPress={() => { setStars(0); setComment(''); setScr('rate'); }} />
    </Page>
  );
  if (scr === 'rate') return (
    <Page {...P} title="শুভেচ্ছা! আপনি পৌঁছে গেছেন">
      <Text style={s.p}>{pick.name}-কে কেমন লাগল?</Text>
      <View style={s.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setStars(n)}><Text style={{ fontSize: 40, color: n <= stars ? C.yellow : C.line }}>★</Text></TouchableOpacity>
        ))}
      </View>
      <TextInput style={s.in} placeholder="মন্তব্য (ঐচ্ছিক, শুধু অ্যাডমিন দেখবে)" value={comment} onChangeText={setComment} />
      <Btn t="জমা দিন" disabled={stars === 0} onPress={() => { setHist([{ from, to, veh: veh.name, driver: pick.name, fare: fare + tip, stars }, ...hist]); setFrom(''); setTo(''); setTip(0); setTab('hist'); setScr('main'); }} />
    </Page>
  );
  return null;
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  logo: { alignSelf: 'center', width: 110, height: 110, borderRadius: 55, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 34, fontWeight: '800', color: C.green, textAlign: 'center', marginTop: 16 },
  brand2: { fontSize: 20, fontWeight: '700', color: C.dark, textAlign: 'center', marginTop: 6 },
  sub: { fontSize: 14, color: C.mute, textAlign: 'center', marginTop: 4 },
  h1: { fontSize: 24, fontWeight: '800', color: C.dark, marginVertical: 14 },
  h2: { fontSize: 18, fontWeight: '700', color: C.dark, marginTop: 20, marginBottom: 8 },
  back: { color: C.green, fontSize: 16, marginTop: 8 },
  p: { fontSize: 14, color: C.mute, marginVertical: 4 },
  in: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 14, fontSize: 17, marginVertical: 6, color: C.dark },
  in2: { fontSize: 16, color: C.dark, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  btn: { backgroundColor: C.green, borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginVertical: 10 },
  btnT: { color: '#fff', fontSize: 17, fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginVertical: 6, borderWidth: 1, borderColor: C.line },
  cardT: { fontSize: 17, fontWeight: '700', color: C.dark },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  vcard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: C.line },
  vsel: { borderColor: C.green, backgroundColor: C.pale },
  vic: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.pale, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tick: { position: 'absolute', right: 12, top: 12, color: C.green, fontSize: 18, fontWeight: '800' },
  min: { fontSize: 12, color: C.green, fontWeight: '700', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  pm: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  pmT: { color: '#fff', fontSize: 26, fontWeight: '700' },
  fare: { fontSize: 24, fontWeight: '800', color: C.green, marginHorizontal: 20 },
  chip: { backgroundColor: C.pale, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, margin: 4 },
  tabs: { flexDirection: 'row', margin: 12, padding: 6, backgroundColor: '#fff', borderRadius: 26, borderWidth: 1, borderColor: C.line },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 20 },
  code: { fontSize: 52, fontWeight: '800', color: C.green, textAlign: 'center', letterSpacing: 10, marginVertical: 10 },
  map: { height: 120, backgroundColor: '#DCE8D9', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  tabT: { fontSize: 12, color: C.mute, marginTop: 2 },
});

// 預設 1180X620
//allowZoom: true,
const ggbCatalog = [
    {
        tags:["圓周率","數學實驗"],
        title: "布豐投針實驗",
        file: "buffon.ggb",
        note: "隨機投針到地板上，觀察針與地板縫相交的機率，以此方式模擬計算圓周率 π 的近似值。\n按左上的「A」開始模擬。"
    },
    {
        tags:["圓周率","數學實驗"],
        title: "蒙地卡羅估算法",
        file: "MonteCarlo.ggb",
        note: "類似布豐投針實驗，改成利用隨機的點落在圓內的機率（園面積／外切正方形面積），以此方式模擬計算圓周率 π 的近似值，比起投針更容易理解。\n按左上的「A」開始模擬。"
    },
    {
        tags:["圓周率"],
        title: "阿基米德多邊形逼近法",
        file: "Archimedes.ggb",
        note: "利用圓外切、內接正多邊形的周長，從正六邊形出發，每次都把邊數加倍，逐漸逼近 π 的值。"
    },
    {
        tags:["多項式"],
        title: "韋達公式",
        youtube:"https://www.youtube.com/watch?v=OuqGT5G2_jA",
        note: "高中學到的根與係數的關係，其實是韋達發明的公式，想不到在某些奇妙的影片中會出現，真是受用無窮！"
    },
    {
        tags:["數論"],
        title: "訊息數值化與進位制",
        youtube:"https://www.youtube.com/watch?v=_k-GF1GAHHI",
        note: "烘焙王的故事中，一直存在一個神奇的數學謎題，擁有太陽之手的主角竟然能秒解!? 到底是什麼謎題？"
    },
    {
        tags:["極座標曲線"],
        title: "極座標曲線模擬器",
        file: "polarcurve.ggb",
        note: "我們習慣使用的函數y=f(x)，若轉變為極座標上的函數r=f(t)，會發生什麼事？試著填入你的函數吧！\n點擊文字框後，再點開左下角鍵盤開關。"
    },
    {
        tags:["極座標曲線","地球科學"],
        title: "極座標與地圖",
        file: "map.ggb",
        note: "把南極中心展開變成一條線，就是圓柱等距地圖！極座標曲線則是反過來，將x軸捏成原點，而y座標則變成原點到動點的距離。"
    },
    {
        tags:["魔術方塊"],
        title: "高階方塊對邊交換",
        youtube: "https://www.youtube.com/watch?v=eYOHfv0b_C0",
        note: "基本上是公式演示，點擊觀看完整影片。"
    },
    {
        tags:["魔術方塊"],
        title: "高階方塊單邊翻轉",
        youtube: "https://www.youtube.com/watch?v=dhaYCQqy9D8",
        note: "基本上是公式演示，點擊觀看完整影片。"
    },
    {
        tags:["圓錐曲線","橢圓"],
        title: "在橢圓的焦點呼喊愛",
        youtube: "https://www.youtube.com/watch?v=X5SoHm1w_wE",
        note: "在橢圓上的焦點說話時，聲音會準確的聚集在另一個焦點上。如果你我都在橢圓的焦點上，相信我們的心聲都會進入彼此的心中。"
    },
    {
        tags:["圓錐曲線","橢圓","生活應用"],
        title: "體外震波碎石術",
        file: "kidney.ggb",
        note: "在橢圓上的焦點發出超音波時，能量會逐漸分散，但是碰到橢圓壁後，又會集中在另一個焦點上。這樣就能精準擊碎腎結石，而不會把你的腎打爛！\n拉動橢圓邊界並且想想看，怎麼樣的橢圓比較適合這個手術？"
    },
    {
        tags:["圓錐曲線","雙曲線","自製玩具"],
        title: "會轉彎的直線",
        youtube: "https://youtube.com/shorts/WHuASUVME5Q",
        note: "你知道嗎？一把義大利麵可以做出一個單葉雙曲面，一個單葉雙曲面又可以縱切變成雙曲線，然後又可以用義大利麵巧妙的穿過他！"
    },
    {
        tags:["黃金比例","自製玩具"],
        title: "Helicon：螺旋與松果聯想出的玩具",
        youtube: "https://youtube.com/shorts/sGxqeGhyduI",
        note: "如果把黃金比例應用在角度上，就會出現松果的排列方式，這排列方式又會和費氏數列有關係。這是巧合嗎？\n我可不這麼認為！"
    },
    {
        tags:["地球科學"],
        title: "如果地心說是正確的，太陽系長什麼樣子？",
        youtube: "https://www.youtube.com/watch?v=VkgqsjPy1m4",
        note: "如果以地心說的視角來觀察世界，會看到什麼樣的景象？\n（太陽：紅色、金星：橘色、木星：綠色）"
    }
    
];

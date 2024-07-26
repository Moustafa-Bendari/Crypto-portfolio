const URL = "https://api.coingecko.com/api/v3/coins/";
const URL2 = "https://api.coincap.io/v2/assets";
// const NEWSURL = "https://api.marketaux.com/v1/news/all?language=en&api_token=rHh7bLzkHWemOyThaWhNlv4oFGhkzv22nVXy1EMT"
const COINBASEURL =
  "https://api.developer.coinbase.com/rpc/v1/base/D0jBiNT0dtUAcHt4CKgKAJKkpH7mCYTH";
Vue.createApp({
  data() {
    return {
      currentPage: "Home",
      user: {
        name: "",
        email: "",
        password: "",
      },
      //Change start here
      newUser: {
        name: "",
        email: "",
        password: "",
      },
      //Change end here
      search2: "",
      search: "",
      chartmode: "graphdiv",
      currentUser: null,
      limitedfav:[],
      pages: [
        { text: "Dashboard", image: "/images/icons/dashboard.svg" },
        { text: "Chart", image: "/images/icons/bar-chart-2.svg" },
        { text: "Coins", image: "images/icons/bitcoin-brands-solid.svg" },
        { text: "News", image: "/images/icons/news.svg" },
        { text: "Wallet", image: "/images/icons/wallet.svg" },
        {text: "Settings",image: "/images/icons/settings-outline.svg"},
      ],
      timeframe: "365",
      times: [
        { text: "1y", days: "365" },
        { text: "6m", days: "180" },
        { text: "1m", days: "30" },
        { text: "1w", days: "7" },
        { text: "1d", days: "1" },
      ],
      cryptoID: "bitcoin",
      cryptoData: [],
      cryptoData2: [],
      cryptoData3: [],
      cryptoData4: [],
      news: [],
      currentNews: "btc",
    favorites: [],
    favoritesarray:[]
    };
  },
  methods: {
    //Change start here
    login: async function () {
      let response = await fetch("/session", {
        body: JSON.stringify(this.user),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 201) {
        this.currentUser = await response.json()
        //successful sign in
        // alert("Successfully logged in");
        this.setPage("Dashboard");
      } else if (response.status == 401 || response.status == 404) {
        alert("Unsuccessful login attempt");
      }
    },
    register: async function () {
      let response = await fetch("/users", {
        body: JSON.stringify(this.newUser),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 201) {
        //successful user creation
        this.newUser.name = "";
        this.newUser.email = "";
        (this.newUser.password = ""), this.setPage("Login");
        alert("Successfully created user! Please login");
      } else if (response.status == 422) {
        alert("Failed to create user");
        //unsuccessful creation
      } else {
        //server error
      }
    },
    getSession: async function () {
      let response = await fetch("/session");
      if (response.status === 200) {
        let data = await response.json();
        this.currentUser = data
        console.log(data)
        this.favorites = data.trackedcoins
         await this.getcryptodata3()
         this.setPage("Dashboard");

        if (this.cryptoData5.length > 0) {
        this.favoritesarraywork();
      } else {
        console.error("cryptoData5 is not populated yet");
      }
      }
    },
    deleteSession: async function (){
      let response = await fetch("/session", {
        method: "DELETE",
          });
          if (response.status === 204) {
            this.setPage("Login");
            }
          else{
            console.log("error")
          }
    },
    //Change ends here
    async getcryptodata() {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-StMKU8Y2HFSrmSkoTuP3Q986",
          },
        };

        const response = await fetch(
          `${URL}${this.cryptoID}/market_chart?vs_currency=usd&days=${this.timeframe}`,
          requestOptions
        );
        const data = await response.json();
        this.cryptoData = data.prices;

        this.renderChart();
      } catch (error) {
        console.log("Error fetching crypto data:", error);
      }
    },
    async getcryptodataFree() {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(`${URL2}`, requestOptions);
      const data = await response.json();
      this.cryptoData4 = data
      this.cryptoData2 = this.cryptoData4.data.slice(0,25);
      console.log("cd4", this.cryptoData4)
      
    },
    async getcryptodata3() {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-StMKU8Y2HFSrmSkoTuP3Q986",
        },
      };

      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",
          options
        );
        const data = await response.json();

        this.cryptoData5 = data;
        this.cryptoData3 = this.cryptoData5.slice(0,20)
        console.log("cd5 get cryptodata5",this.cryptoData5)

        console.log("cd3", this.cryptoData3);
      } catch (err) {
        console.error(err);
      }
    },
    // async getNews(){
    //     const options = {
    //         method: 'GET',
    //         headers: {accept: 'application/json',
    //         'x-cg-demo-api-key': 'rHh7bLzkHWemOyThaWhNlv4oFGhkzv22nVXy1EMT'}
    //       };
    //     try {
    //         const response = await fetch(NEWSURL, options )
    //         const data = await response.json();
    //         this.news = data;
    //         console.log(this.news);
    //       } catch (err) {
    //         console.error(err);}
    // },
    async setPage(Page) {
      document.title = "TRAKR | " + Page;
      this.currentPage = Page;
      if (Page == "Dashboard") {
        // this.cryptoID="bitcoin"
        document.getElementById("cryptodropdown").value = "Bitcoin";

        this.chartmode = "graphdiv";
        this.getcryptodata();
      } else if (Page == "Chart") {
        this.chartmode = "chartgraph";
        this.getcryptodata();
      } else if (Page == "Settings")
      {
        let response = await fetch("/session");
        if (response.status === 200) {
        let data = await response.json();
        this.currentUser = data
        this.favorites = data.trackedcoins
        this.favoritesarraywork();
      }
      }
    },
    setTimeframe(time) {
      this.timeframe = time;
      this.cryptoData = [];
      console.log("time ", this.timeframe);
      this.getcryptodata();
    },
    formatprice(price) {
      let number = parseFloat(price);
      let newnumber = number.toFixed(2);
      return newnumber;
    },
    addFavorite(coin){
      if( this.favorites.includes(coin)){
        this.favorites.splice(this.favorites.indexOf(coin), 1);
      }
      else{
        this.favorites.push(coin);
      }
      this.updateUserCoins();

      

    },
    favoritesarraywork(){
      if (this.favorites.length > 4) {
        this.favoritesarray = this.favorites.slice(0, 4).map(favorite => {
          return this.cryptoData5.find(coin => coin.id === favorite);
        });
      } else {
        this.favoritesarray = this.favorites.map(favorite => {
          return this.cryptoData5.find(coin => coin.id === favorite);
        });
      }    },
    // getCryptoName(cryptoID){
    //     let name = ""
    //     name = cryptoID.charAt(0).toUpperCase()+cryptoID.slice(1)
    //     name += "/" + this.cryptoData2.data.find(item=>item.id===cryptoID).symbol
    //     return name
    // }
    setCryptoId(event) {
      // this.cryptoID = event.target.value.toLowerCase()
      // this.cryptoID = this.cryptoData3.find(item => item.name === event.target.value).id
      console.log(this.cryptoID);
      if (document.getElementById("cryptoChart")) {
        document.getElementById("cryptoChart").remove();
      }
      this.getcryptodata();
    },
    getCryptoName(cryptoID) {
      let name = cryptoID.charAt(0).toUpperCase() + cryptoID.slice(1);

      for (let i = 0; i < this.cryptoData2.data.length; i++) {
        if (this.cryptoData2.data[i].id === cryptoID) {
          name += "/" + this.cryptoData2.data[i].symbol;
          break;
        }
      }

      return name;
    },
    fullpage() {
      this.chartmode = "chartgraph";
      this.setPage("Chart");
      console.log(this.currentPage);
      this.getcryptodata();
    },
    async updateUserCoins() {
      //this function will also most likely be the same function that handles a user favoriting a coin
      console.log(this.currentUser)
      console.log(this.favorites)
      let response = await fetch(`/users/${this.currentUser._id}`, {
        body: JSON.stringify(this.favorites),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      this.favoritesarraywork();
    },
    renderChart() {
      if (document.getElementById("cryptoChart")) {
        document.getElementById("cryptoChart").remove();
      }
      // let le = document.getElementById("chartgraph")
      // let chart = document.createElement("canvas")
      // chart.setAttribute("id", "cryptoChart")
      let el = document.getElementById(this.chartmode);
      console.log(el);
      let canvas = document.createElement("canvas");
      console.log("canvas: ", canvas);
      canvas.setAttribute("id", "cryptoChart");
      el.appendChild(canvas);
      const ctx = document.getElementById("cryptoChart").getContext("2d");
      const chartData = this.cryptoData.map((item) => ({
        x: item[0],
        y: item[1],
      }));
      console.log(chartData);
      new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Price",
              data: chartData,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          hover: {
            intersect: false,
          },
          elements: {
            point: {
              radius: 0.01,
              hoverRadius: 10,
            },
          },
          scales: {
            x: {
              type: "time",

              time: {
                unit: "day",
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    async getNews(symbol) {
      this.news = [];
      let coin = this.convertCoin(symbol);
      try {
        const response = await fetch(`/news/${coin}`);
        const data = await response.json();
        // for (article in data) {
        //   this.news.push(article);
        //   console.log(this.news[article]);
        // }
        console.log("our data:", data);
        this.news = data;
      } catch (error) {
        console.error("Error fetching news:", error);
        throw error; // Rethrow the error for handling in calling function
      }
    },

    convertCoin(coin) {
      let formatCoin = coin.toUpperCase();
      formatCoin += "-USD";
      return formatCoin;
    },

  },
  watch: {
      detectText: function (){
        console.log("change")
      }
  },
  computed: {
    filteredcrypto: function () {
      if(this.cryptoData5){
        return this.cryptoData5.filter((coin) => {
          return coin.name
            .toLowerCase()
            .includes(this.search2.toLowerCase());
        });
      }
    },
    filteredcoins: function () {
      if(this.cryptoData4){
        return this.cryptoData4.data.filter((coin) => {
          return coin.name
            .toLowerCase()
            .includes(this.search.toLowerCase());
        });
      }
    },
  },
  async created() {
    console.log("created");
    document.title = "TRAKR | " + this.currentPage;
    this.getcryptodata();
    this.getcryptodataFree();
    await this.getcryptodata3();
    this.getNews(this.currentNews);
    this.getSession();
    
  }
  ,
}).mount("#app");



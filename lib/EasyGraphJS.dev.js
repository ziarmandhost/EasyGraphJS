class EasyGraphJS {
    constructor (w, h, styles, container) {
        try {
            this.isEmpty = val => (val === undefined || val === null || val.length <= 0);
            this.error = errorText => { console.error("[EasyGraphJS] : " + errorText); };
            this.log = logText => { console.log("[EasyGraphJS] : " + logText); };
            this.getDistance = 18;

            let canvas = this.canvas = document.createElement("canvas");
            let context = this.context = canvas.getContext("2d");
            let holder = document.body;

            this.context.mozImageSmoothingEnabled = false;
            this.context.webkitImageSmoothingEnabled = false;
            this.context.msImageSmoothingEnabled = false;
            this.context.imageSmoothingEnabled = false;

            if (typeof w !== "number" || typeof h !== "number") {
                this.error("You need to set width and height of graph!");
            }
            else {
                try {
                    canvas.style.width = Math.floor(w) + "px";
                    canvas.style.height =  Math.floor(h) + "px";

                    this.width = canvas.width =  Math.floor(w);
                    this.height = canvas.height =  Math.floor(h);
                }
                catch {
                    this.error("Cannot set width and height of graph!");
                }

                if (!this.isEmpty(styles)) {
                    if (typeof styles === "object") {
                        for (let style in styles) {
                            if (style === "bgColor") {
                                try {
                                    canvas.style.backgroundColor = styles[style];
                                }
                                catch {
                                    this.error("Cannot set background color of graph!");
                                }
                            }
                            else continue;
                        }
                    }
                    else {
                        this.error("Third parameter must be an object!");
                    }
                }
                if (container) {
                    if (typeof container === "string") {
                        holder = document.querySelector(container);
                    }
                    else {
                        this.error("Container not found!");
                        holder = document.body;
                    }
                }
            }

            this.context.transform(1, 0, 0, -1, 0, this.height);
            this.context.save();

            holder.appendChild(this.canvas);
        }
        catch (error) {
            this.error("Error during graph initialization!");
        }
    }

    static rgba (red, green, blue, alpha) {
        let isEmpty = val => (val === undefined || val === null || val.length <= 0);
        let error = errorText => { console.error("[EasyGraphJS] : " + errorText); };
        if (isEmpty(red) || isEmpty(green) || isEmpty(blue) || isEmpty(alpha)) {
            error('The "RGBA" function must accept 4 parameters!');
        }
        else {
            if (typeof red === "number" && typeof green === "number" && typeof blue === "number" && typeof alpha === "number") {
                if (red >= 0 && red <= 255 && green >= 0 && green <= 255 && blue >= 0 && blue <= 255) {
                    if (alpha >= 0 && alpha <= 1) {
                        return "rgba("+ Math.floor(red)+","+ Math.floor(green)+","+ Math.floor(blue)+","+alpha+")";
                    }
                    else {
                        error('The last parameter of the function "rgba" must be greater than 0 and less than 1!');
                    }
                }
                else {
                    error('The first three parameters of the function "rgba" must be greater than 0 and less than 255!');
                }
            }
            else {
                error('All parameters of the function "rgba" must be numbers');
            }
        }
    }

    static rgb (red, green, blue) {
        let isEmpty = val => (val === undefined || val === null || val.length <= 0);
        let error = errorText => { console.error("[EasyGraphJS] : " + errorText); };
        if (isEmpty(red) || isEmpty(green) || isEmpty(blue)) {
            error('The "RGB" function must accept 3 parameters!');
        }
        else {
            if (typeof red === "number" && typeof green === "number" && typeof blue === "number") {
                if (red >= 0 && red <= 255 && green >= 0 && green <= 255 && blue >= 0 && blue <= 255) {
                    return "rgba("+ Math.floor(red)+","+ Math.floor(green)+","+ Math.floor(blue)+")";
                }
                else {
                    error('All parameters of the function "rgb" must be greater than 0 and less than 255!');
                }
            }
            else {
                error('All parameters of the function "rgb" must be numbers');
            }
        }
    }

    clear () {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    point (params) { // x, y
        if (!this.isEmpty(params)) {
            try {
                if (this.isEmpty(params.x)) {
                    this.error("You need to set X coordinate of point!");
                }
                else if (this.isEmpty(params.y)) {
                    this.error("You need to set Y coordinate of point!");
                }
                else {
                    if (typeof params.x === "number" && typeof params.y === "number") {
                        this.context.fillStyle = params.color ? params.color : "black";
                        this.context.fillRect(Math.floor(params.x), Math.floor(params.y), params.size ? params.size : 1, params.size ? params.size : 1);
                    }
                    else {
                        this.error("Point coordinates must be numbers!");
                    }
                }
            }
            catch (error) {
                this.error("Error when drawing a point!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "point" function. This is a bad coding method that can make you become a bad developer!');
        }
    }

    drawPoints (params) {
        if (params.points && typeof params.points === 'object') {
            this.context.lineWidth = params.lineWidth ? (params.lineWidth < 1 ? 1 : Math.floor(params.lineWidth)) : 1;
            this.context.strokeStyle = params.color ? params.color : "black";

            let dotsSize = params.pointsStyle.size ? params.pointsStyle.size : 10;
            let fontSize = params.pointsStyle.fontSize ? params.pointsStyle.fontSize : 10;
            let fontFamily = params.pointsStyle.fontFamily ? params.pointsStyle.fontFamily : "Arial";
            let color = params.pointsStyle.color ? params.pointsStyle.color : "black";

            for (let i = 0; i < params.points.length; i++) {
                this.context.beginPath();

                this.context.moveTo(params.points[i][0], params.points[i][1]);

                if (params.points[i][2]) {
                    let dir = params.points[i][2].top ? fontSize : (-fontSize);
                    this.text({
                        x : params.points[i][0] - dotsSize/2 ,
                        y : params.points[i][1] - dotsSize/2 + dir,
                        text : params.points[i][2].text,
                        font : {
                            size : fontSize,
                            type : fontFamily,
                            align : "center"
                        },
                        color
                    });
                }

                this.point({
                    x : params.points[i][0] - dotsSize/2,
                    y : params.points[i][1] - dotsSize/2,
                    size : dotsSize,
                    color
                });

                if (params.points[i] === params.points[params.points.length - 1]) {
                    this.context.lineTo(params.points[i][0], params.points[i][1]);

                    this.context.closePath();
                    this.context.stroke();

                    if (params.points[i][2]) {
                        let dir = params.points[i][2].top ? fontSize : (-fontSize);
                        this.text({
                            x : params.points[i][0] - dotsSize/2 ,
                            y : params.points[i][1] - dotsSize/2 + dir,
                            text : params.points[i][2].text,
                            font : {
                                size : fontSize,
                                type : fontFamily,
                                align : "center"
                            },
                            color
                        });
                    }

                    this.point({
                        x : params.points[i][0] - dotsSize/2,
                        y : params.points[i][1] - dotsSize/2,
                        size : dotsSize,
                        color
                    });
                }
                else {
                    this.context.lineTo(params.points[i + 1][0], params.points[i + 1][1]);

                    this.context.closePath();
                    this.context.stroke();

                    if (params.points[i + 1][2]) {
                        let dir = params.points[i + 1][2].top ? fontSize : (-fontSize);
                        this.text({
                            x : params.points[i + 1][0] - dotsSize/2 ,
                            y : params.points[i + 1][1] - dotsSize/2 + dir,
                            text : params.points[i + 1][2].text,
                            font : {
                                size : fontSize,
                                type : fontFamily,
                                align : "center"
                            },
                            color
                        });
                    }

                    this.point({
                        x : params.points[i + 1][0] - dotsSize/2,
                        y : params.points[i + 1][1] - dotsSize/2,
                        size : dotsSize,
                        color
                    });
                }
            }
        } 
        else {
           this.error("You need to set correct coordinates of points!");
        }
    }

    line (params) { // points [ [...], [...] ], color, lineWidth
        if (!this.isEmpty(params)) {
            try {
                if (!params.points || params.points.length !== 2) {
                    this.error("You need to set correct coordinates of points of your line!");
                }
                else {
                    let color = params.color ? params.color : "black";
                    let width = params.lineWidth ? (params.lineWidth < 1 ? 1 : Math.floor(params.lineWidth)) : 1;

                    this.context.beginPath();

                    this.context.lineWidth = width;
                    this.context.strokeStyle = color;

                    this.context.moveTo(Math.floor(params.points[0][0]), Math.floor(params.points[0][1]));
                    this.context.lineTo(Math.floor(params.points[1][0]), Math.floor(params.points[1][1]));

                    this.context.stroke();
                }
            }
            catch (error) {
                this.error("Error when drawing a line!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "line" function. This is a bad coding method that can make you become a bad developer!');
        }
    }

    grid (params) { // distance, lineWidth, color
        if (this.isEmpty(params) || !params) {
            this.log('You do not want to use any parameters in the "grid" function. This is a bad coding method that can make you become a bad developer!');
        }

        let distance;

        if (params) {
            if (params.size) {
                if (params.size < 1) {
                    distance = 1;
                }
                else {
                    distance = Math.floor(params.size);
                }
            }
            else {
                distance = this.getDistance;
            }
        }
        else {
            distance = this.getDistance;
        }

        let width = params.lineWidth ? (params.lineWidth < 1 ? 1 : Math.floor(params.lineWidth)) : 1;
        let color = params ? (params.color ? params.color : "black") : "black";

        this.context.beginPath();

        this.context.lineWidth = width;
        this.context.strokeStyle = color;

        for (let x = Math.floor(width / 2); x <= this.width; x += distance) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.height);
        }

        for (let y = Math.floor(width / 2); y <= this.height; y += distance) {
            this.context.moveTo(0, y);
            this.context.lineTo(this.width, y);
        }

        this.context.stroke();
    }

    rectangle (params) { // x, y, w, h, angle, bgColor, stroke {lineWidth, color}, rounded { radius }
        if (!this.isEmpty(params)) {
            try {
                if (this.isEmpty(params.x)) {
                    this.error("You need to set X coordinate of rectangle!");
                }
                else if (this.isEmpty(params.y)) {
                    this.error("You need to set Y coordinate of rectangle!");
                }
                else if (this.isEmpty(params.width)) {
                    this.error("You need to set width of rectangle!");
                }
                else if (this.isEmpty(params.height)) {
                    this.error("You need to set height of rectangle!");
                }
                else {
                    if (typeof params.x === "number" && typeof params.y === "number") {
                        if (typeof params.width === "number" && typeof params.height === "number") {
                            if (params.rounded && typeof params.rounded === "object") {
                                if (params.rounded.radius && typeof params.rounded.radius === "number") {
                                    if (params.stroke && typeof params.stroke === "object") {
                                        let strokeColor = params.stroke.color ? params.stroke.color : "black";
                                        let strokeWidth = params.stroke.lineWidth ? (params.stroke.lineWidth < 1 ? 1 : Math.floor(params.stroke.lineWidth)) : 1;

                                        this.context.beginPath();

                                        this.context.lineWidth = strokeWidth;
                                        this.context.strokeStyle = strokeColor;

                                        params.x = Math.floor(params.x);
                                        params.y = Math.floor(params.y);
                                        params.width = Math.floor(params.width);
                                        params.height = Math.floor(params.height);
                                        params.rounded.radius = Math.floor(params.rounded.radius);

                                        this.context.moveTo(params.x, params.y + params.rounded.radius);
                                        this.context.lineTo(params.x, params.y + params.height - params.rounded.radius);
                                        this.context.arcTo(params.x, params.y + params.height, params.x + params.rounded.radius, params.y + params.height, params.rounded.radius);
                                        this.context.lineTo(params.x + params.width - params.radius, params.y + params.height);
                                        this.context.arcTo(params.x + params.width, params.y + params.height, params.x + params.width, params.y + params.height - params.rounded.radius, params.rounded.radius);
                                        this.context.lineTo(params.x + params.width, params.y + params.rounded.radius);
                                        this.context.arcTo(params.x + params.width, params.y, params.x + params.width - params.rounded.radius, params.y, params.rounded.radius);
                                        this.context.lineTo(params.x + params.rounded.radius, params.y);
                                        this.context.arcTo(params.x, params.y, params.x, params.y + params.rounded.radius, params.rounded.radius);

                                        this.context.stroke();
                                    }
                                    else {
                                        let bgColor = params.bgColor ? params.bgColor : "black";

                                        this.context.beginPath();

                                        this.context.fillStyle = bgColor;

                                        params.x = Math.floor(params.x);
                                        params.y = Math.floor(params.y);
                                        params.width = Math.floor(params.width);
                                        params.height = Math.floor(params.height);
                                        params.rounded.radius = Math.floor(params.rounded.radius);

                                        this.context.moveTo(params.x, params.y + params.rounded.radius);
                                        this.context.lineTo(params.x, params.y + params.height - params.rounded.radius);
                                        this.context.arcTo(params.x, params.y + params.height, params.x + params.rounded.radius, params.y + params.height, params.rounded.radius);
                                        this.context.lineTo(params.x + params.width - params.radius, params.y + params.height);
                                        this.context.arcTo(params.x + params.width, params.y + params.height, params.x + params.width, params.y + params.height - params.rounded.radius, params.rounded.radius);
                                        this.context.lineTo(params.x + params.width, params.y + params.rounded.radius);
                                        this.context.arcTo(params.x + params.width, params.y, params.x + params.width - params.rounded.radius, params.y, params.rounded.radius);
                                        this.context.lineTo(params.x + params.rounded.radius, params.y);
                                        this.context.arcTo(params.x, params.y, params.x, params.y + params.rounded.radius, params.rounded.radius);

                                        this.context.fill();
                                    }
                                }
                                else {
                                    this.error("The Radius of the rounded rectangle must be a number!");
                                }
                            }
                            else {
                                if (params.stroke && typeof params.stroke === "object") {
                                    let strokeColor = params.stroke.color ? params.stroke.color : "black";
                                    let strokeWidth = params.stroke.lineWidth ? (params.stroke.lineWidth < 1 ? 1 : Math.floor(params.stroke.lineWidth)) : 1;

                                    this.context.lineWidth = strokeWidth;
                                    this.context.strokeStyle = strokeColor;
                                    this.context.strokeRect(Math.floor(params.x), Math.floor(params.y), Math.floor(params.width), Math.floor(params.height));
                                }
                                else {
                                    let bgColor = params.bgColor ? params.bgColor : "black";
                                    this.context.fillStyle = bgColor;
                                    this.context.fillRect(Math.floor(params.x), Math.floor(params.y), Math.floor(params.width), Math.floor(params.height));
                                }
                            }
                        }
                        else {
                            this.error("The size of the rectangle must be a number!");
                        }
                    }
                    else {
                        this.error("Rectangle coordinates must be numbers!");
                    }
                }
            }
            catch (error) {
                this.error("Error when drawing a rectangle!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "rectangle" function. This is a bad coding method that can make you become a bad developer!');
        }
    }

    triangle (params) { // points [ [...], [...], [...] ], stroke { lineWidth, color }, bgColor
        if (!this.isEmpty(params)) {
            try {
                if (this.isEmpty(params.points) || params.points.length !== 3 || params.points[0].length !== 2 || params.points[1].length !== 2 || params.points[2].length !== 2) {
                    this.error("You need to set correct coordinates of points of your triangle!");
                }
                else {
                    if (params.stroke && typeof params.stroke === "object") {
                        let strokeColor = params.stroke.color ? params.stroke.color : "black";
                        let strokeWidth = params.stroke.lineWidth ? (params.stroke.lineWidth < 1 ? 1 : Math.floor(params.stroke.lineWidth)) : 1;

                        this.context.beginPath();

                        this.context.lineWidth = strokeWidth;
                        this.context.strokeStyle = strokeColor;

                        this.context.moveTo(Math.floor(params.points[0][0]), Math.floor(params.points[0][1]));
                        this.context.lineTo(Math.floor(params.points[1][0]), Math.floor(params.points[1][1]));
                        this.context.lineTo(Math.floor(params.points[2][0]), Math.floor(params.points[2][1]));
                        this.context.lineTo(Math.floor(params.points[0][0]), Math.floor(params.points[0][1]));

                        this.context.stroke();
                    }
                    else {
                        let bgColor = params.bgColor ? params.bgColor : "black";

                        this.context.beginPath();

                        this.context.fillStyle = bgColor;

                        this.context.moveTo(Math.floor(params.points[0][0]), Math.floor(params.points[0][1]));
                        this.context.lineTo(Math.floor(params.points[1][0]), Math.floor(params.points[1][1]));
                        this.context.lineTo(Math.floor(params.points[2][0]), Math.floor(params.points[2][1]));
                        this.context.lineTo(Math.floor(params.points[0][0]), Math.floor(params.points[0][1]));

                        this.context.fill();
                    }
                }
            }
            catch (error) {
                this.error("Error when drawing a triangle!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "triangle" function. This is a bad coding method that can make you become a bad developer!');
        }
    }
    
    circle (params) { // x, y, radius, bgColor, stroke { lineWidth, color }
        if (!this.isEmpty(params)) {
            try {
                if (this.isEmpty(params.x) || this.isEmpty(params.y)) {
                    this.error("You need to set coordinates of circle!");
                }
                else if (this.isEmpty(params.radius)) {
                    this.error("You need to set radius of circle!");
                }
                else {
                    if (typeof params.x === "number" && typeof params.y === "number" && typeof params.radius === "number") {
                        if (params.stroke && typeof params.stroke === "object") {
                            let strokeColor = params.stroke.color ? params.stroke.color : "black";
                            let strokeWidth = params.stroke.lineWidth ? (params.stroke.lineWidth < 1 ? 1 : Math.floor(params.stroke.lineWidth)) : 1;

                            this.context.beginPath();

                            this.context.lineWidth = strokeWidth;
                            this.context.strokeStyle = strokeColor;

                            this.context.arc(Math.floor(params.x), Math.floor(params.y), Math.floor(params.radius), 0, Math.PI * 2, true);
                            this.context.stroke();
                        }
                        else {
                            let bgColor = params.bgColor ? params.bgColor : "black";

                            this.context.beginPath();

                            this.context.fillStyle = bgColor;

                            this.context.arc(Math.floor(params.x), Math.floor(params.y), Math.floor(params.radius), 0, Math.PI * 2, true);
                            this.context.fill();
                        }
                    }
                    else {
                        this.error("Parameters of circle must be numbers!");
                    }
                }
            }
            catch (error) {
                this.error("Error when drawing a circle!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "circle" function. This is a bad coding method that can make you become a bad developer!');
        }
    }

    ellipse (params) { // x, y, radius { x, y }, angle, bgColor, stroke { lineWidth, color }
        if (!this.isEmpty(params)) {
            try {
                if (this.isEmpty(params.x) || this.isEmpty(params.y)) {
                    this.error("You need to set coordinates of ellipse!");
                }
                else if (!params.radius || typeof params.radius !== "object") {
                    this.error("You need to set right radii of ellipse!");
                }
                else {
                    if (typeof params.x === "number" && typeof params.y === "number") {
                        if (params.radius.x && typeof params.radius.x === "number" && params.radius.y && typeof params.radius.y === "number") {
                            if (params.stroke && typeof params.stroke === "object") {
                                let strokeColor = params.stroke.color ? params.stroke.color : "black";
                                let strokeWidth = params.stroke.lineWidth ? (params.stroke.lineWidth < 1 ? 1 : Math.floor(params.stroke.lineWidth)) : 1;

                                let angle = 1;

                                if (params.angle && typeof params.angle === "number") {
                                    if ( params.angle >= 0 && params.angle <= 1)  {
                                        angle = params.angle;
                                    }
                                    else {
                                        this.error("Angle must be greater than 0 and less than 1!");
                                    }
                                }

                                this.context.beginPath();

                                this.context.lineWidth = strokeWidth;
                                this.context.strokeStyle = strokeColor;

                                for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
                                    let xPos = params.x - (params.radius.x * Math.sin(i)) * Math.sin(angle * Math.PI) + (params.radius.y * Math.cos(i)) * Math.cos(angle * Math.PI);
                                    let yPos = params.y + (params.radius.y * Math.cos(i)) * Math.sin(angle * Math.PI) + (params.radius.x * Math.sin(i)) * Math.cos(angle * Math.PI);

                                    if (i === 0) {
                                        this.context.moveTo(xPos, yPos);
                                    }
                                    else {
                                        this.context.lineTo(xPos, yPos);
                                    }
                                }

                                this.context.stroke();
                            }
                            else {
                                let bgColor = params.bgColor ? params.bgColor : "black";
                                let angle = 0;

                                if (params.angle && typeof params.angle === "number") {
                                    if ( params.angle >= 0 && params.angle <= 1)  {
                                        angle = params.angle;
                                    }
                                    else {
                                        this.error("Angle must be greater than zero and less than one!");
                                    }
                                }

                                this.context.beginPath();

                                this.context.fillStyle = bgColor;

                                for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
                                    let xPos = params.x - (params.radius.x * Math.sin(i)) * Math.sin(angle * Math.PI) + (params.radius.y * Math.cos(i)) * Math.cos(angle * Math.PI);
                                    let yPos = params.y + (params.radius.y * Math.cos(i)) * Math.sin(angle * Math.PI) + (params.radius.x * Math.sin(i)) * Math.cos(angle * Math.PI);

                                    if (i === 0) {
                                        this.context.moveTo(xPos, yPos);
                                    }
                                    else {
                                        this.context.lineTo(xPos, yPos);
                                    }
                                }

                                this.context.fill();
                            }
                        }
                        else {
                            this.error("Ellipse radii must be numbers!");
                        }
                    }
                    else {
                        this.error("Ellipse coordinates must be numbers!");
                    }
                }
            }
            catch (error) {
                this.error("Error when drawing a ellipse!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "ellipse" function. This is a bad coding method that can make you become a bad developer!');
        }
    }

    polygon (params) { // points [ [...], [...], [...] ], bgColor, stroke { lineWidth, color }
        if (!this.isEmpty(params)) {
            try {
                if (!params.points || params.points.length < 3) {
                    this.error("You need to set correct coordinates of points of your polygon!");
                }
                else {
                    if (params.stroke && typeof params.stroke === "object") {
                        let strokeColor = params.stroke.color ? params.stroke.color : "black";
                        let strokeWidth = params.stroke.lineWidth ? (params.stroke.lineWidth < 1 ? 1 : Math.floor(params.stroke.lineWidth)) : 1;

                        this.context.beginPath();

                        this.context.lineWidth = strokeWidth;
                        this.context.strokeStyle = strokeColor;

                        for (let i = 0; i < params.points.length; i++) {
                            if (i === 0) {
                                this.context.moveTo(Math.floor(params.points[0][0]), Math.floor(params.points[0][1]));
                            }
                            else {
                                this.context.lineTo(Math.floor(params.points[i][0]), Math.floor(params.points[i][1]));
                            }
                        }

                        this.context.stroke();
                    }
                    else {
                        let bgColor = params.bgColor ? params.bgColor : "black";

                        this.context.beginPath();

                        this.context.fillStyle = bgColor;

                        for (let i = 0; i < params.points.length; i++) {
                            if (i === 0) {
                                this.context.moveTo(Math.floor(params.points[0][0]), Math.floor(params.points[0][1]));
                            }
                            else {
                                this.context.lineTo(Math.floor(params.points[i][0]), Math.floor(params.points[i][1]));
                            }
                        }

                        this.context.fill();
                    }
                }
            }
            catch (error) {
                this.error("Error when drawing a polygon!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "polygon" function. This is a bad coding method that can make you become a bad developer!');
        }
    }

    text (params) { // x, y, text, font { size, type, align, baseline, direction, maxWidth } , color, stroke { lineWidth, color }
        if (!this.isEmpty(params)) {
            try {
                if (this.isEmpty(params.x) || this.isEmpty(params.y)) {
                    this.error("You need to set coordinates of text!");
                }
                else if (!params.text || this.isEmpty(params.text)) {
                    this.error("You must specify the text to be displayed!");
                }
                else if (!params.font || typeof params.font !== "object") {
                    this.error("You must specify the font of text to be displayed!");
                }
                else {
                    if (typeof  params.x === "number" && typeof  params.y === "number" && typeof  params.text === "string" && params.text !== "") {
                        if (params.stroke && typeof params.stroke === "object") {
                            let strokeColor = params.stroke.color ? params.stroke.color : "black";
                            let strokeWidth = params.stroke.lineWidth ? (params.stroke.lineWidth < 1 ? 1 : Math.floor(params.stroke.lineWidth)) : 1;
                            let color = params.color ? params.color : "black";

                            let size = params.font.size ? (Number(params.font.size) % 1 !== 0 ? Math.floor(params.font.size) : params.font.size) : 10;
                            let type = params.font.family ? params.font.family : "sans-serif";
                            let align, baseline, textDirection;

                            if (params.font.align === "start" || params.font.align === "end" || params.font.align === "left"
                                || params.font.align === "right" || params.font.align === "center") {
                                align = params.font.align;
                            }
                            else {
                                align = "start";
                            }

                            if (params.font.baseline === "top" || params.font.baseline === "hanging" || params.font.baseline === "middle"
                                || params.font.baseline === "alphabetic" || params.font.baseline === "ideographic" ||
                                params.font.baseline === "bottom") {
                                baseline = params.font.baseline;
                            }
                            else {
                                baseline = "alphabetic";
                            }
                            
                            if (params.font.direction === "ltr" || params.font.direction === "rtl" || params.font.direction === "inherit") {
                                textDirection = params.font.direction;
                            }
                            else {
                                textDirection = "inherit";
                            }

                            this.context.lineWidth = strokeWidth;
                            this.context.strokeStyle = strokeColor;
                            this.context.fillStyle = color;

                            this.context.font = size + "px " + type;
                            this.context.textAlign  = align;
                            this.context.textBaseline = baseline;
                            this.context.direction  = textDirection;

                            if (params.font.maxWidth && typeof params.font.maxWidth === "number") {
                                this.context.save();
                                this.context.setTransform(1, 0, 0, 1, 0, 0);
                                this.context.strokeText(params.text.trim(), params.x, this.height - params.y, Math.floor(params.font.maxWidth));
                                this.context.restore();
                            }
                            else {
                                this.context.save();
                                this.context.setTransform(1, 0, 0, 1, 0, 0);
                                this.context.strokeText(params.text.trim(), params.x, this.height - params.y);
                                this.context.restore();
                            }
                        }
                        else {
                            let color = params.color ? params.color : "black";

                            let size = params.font.size ? (Number(params.font.size) % 1 !== 0 ? Math.floor(params.font.size) : params.font.size) : 10;
                            let type = params.font.type ? params.font.type : "sans-serif";
                            let align, baseline, textDirection;

                            if (params.font.align === "start" || params.font.align === "end" || params.font.align === "left"
                                || params.font.align === "right" || params.font.align === "center") {
                                align = params.font.align;
                            }
                            else {
                                align = "start";
                            }

                            if (params.font.baseline === "top" || params.font.baseline === "hanging" || params.font.baseline === "middle"
                                || params.font.baseline === "alphabetic" || params.font.baseline === "ideographic" ||
                                params.font.baseline === "bottom") {
                                baseline = params.font.baseline;
                            }
                            else {
                                baseline = "alphabetic";
                            }

                            if (params.font.direction === "ltr" || params.font.direction === "rtl" || params.font.direction === "inherit") {
                                textDirection = params.font.direction;
                            }
                            else {
                                textDirection = "inherit";
                            }

                            this.context.fillStyle = color;

                            this.context.font = size + "px " + type;
                            this.context.textAlign = align;
                            this.context.textBaseline = baseline;
                            this.context.direction = textDirection;

                            if (params.font.maxWidth && typeof params.font.maxWidth === "number") {
                                this.context.save();
                                this.context.setTransform(1, 0, 0, 1, 0, 0);
                                this.context.fillText(params.text.trim(), params.x, this.height - params.y, Math.floor(params.font.maxWidth));
                                this.context.restore();
                            }
                            else {
                                this.context.save();
                                this.context.setTransform(1, 0, 0, 1, 0, 0);
                                this.context.fillText(params.text.trim(), params.x, this.height - params.y);
                                this.context.restore();
                            }
                        }
                    }
                    else {
                        this.error("You must specify the correct type of parameters!");
                    }
                }

            }
            catch (error) {
                this.error("Error when drawing a text!");
            }
        }
        else {
            this.log('You do not want to use any parameters in the "text" function. This is a bad coding method that can make you become a bad developer!');
        }
    }

    axes (params) {
        if (params.labels && typeof params.labels === 'object') {
            let separators = {
                lineWidth: params.separators.lineWidth ? (params.separators.lineWidth < 1 ? 1 : Math.floor(params.separators.lineWidth)) : 1,
                color: params.separators.color ? params.separators.color : 'black'
            };

            let offset = this.offset = {
                x: params.offset && params.offset.x ? params.offset.x : 0,
                y: params.offset && params.offset.y ? params.offset.y : 0
            };

            let fontSize = {
                x : params.text && params.text.x && params.text.x.fontSize ? params.text.x.fontSize : 10,
                y : params.text && params.text.y && params.text.y.fontSize ? params.text.y.fontSize : 10
            };

            let fontFamily = {
                x : params.text.x.fontFamily ? params.text.x.fontFamily : "Arial",
                y : params.text.y.fontFamily ? params.text.y.fontFamily : "Arial"
            };

            this.context.beginPath();

            this.context.lineWidth = this.lineWidth = separators.lineWidth ? (separators.lineWidth < 1 ? 1 : Math.floor(separators.lineWidth)) : 1;
            this.context.strokeStyle = separators.color ? separators.color : "black";

            this.context.moveTo(offset.x + separators.lineWidth / 2, offset.y);
            this.context.lineTo(offset.x + separators.lineWidth / 2, this.height);

            this.context.moveTo(offset.x, separators.lineWidth / 2 + offset.y);
            this.context.lineTo(this.width, separators.lineWidth / 2 + offset.y);

            this.context.closePath();
            this.context.stroke();

            this.context.beginPath();

            this.context.lineWidth = separators.lineWidth;
            this.context.strokeStyle = separators.color;

            let distance = params.distance ? 
                            params.distance.x ? 
                                params.distance.y ? 
                                    params.distance 
                                : {x : params.distance.x, y : 10} 
                            : {x : 10, y : 10}
                           : {x : 10, y : 10};

            for (let x = offset.x + distance.x; x + distance.x/2 < params.labels.horizontal.length * distance.x + offset.x*2; x += distance.x) {
                this.context.moveTo(x, offset.y + fontSize.y/2);
                this.context.lineTo(x, offset.y - fontSize.y/4 - separators.lineWidth);
            }
            for (let y = offset.y + distance.y; y < params.labels.vertical.length * distance.y + offset.y*2; y += distance.y) {
                this.context.moveTo(offset.x - separators.lineWidth - fontSize.y/2, y);
                this.context.lineTo(offset.x - separators.lineWidth*2 + fontSize.y, y);
            }

            if (params.labels.vertical) {
                let pos_y = [];

                this.context.fillStyle = separators.color ? separators.color : 'black';
                this.context.font = fontFamily.y && fontSize.y ? '' + fontSize.y + 'px ' + fontFamily.y : '10px Arial';
                this.context.align = "center";

                for (let v = offset.y + distance.y; v < params.labels.vertical.length * distance.y + offset.y*2; v += distance.y) {
                    pos_y.push([offset.x, this.height - v + this.context.measureText("M").width/2 - 1]);
                }

                for (let elem = 0; elem < params.labels.vertical.length; elem++) {
                    if (pos_y[elem] && pos_y[elem][1]) {
                        this.context.save();
                        this.context.setTransform(1, 0, 0, 1, 0, 0);
                        this.context.fillText(params.labels.vertical[elem], offset.x/2 - fontSize.y, pos_y[elem][1]);
                        this.context.restore();
                    }
                }
            }
            if (params.labels.horizontal) {
                let pos_x = [];

                this.context.fillStyle = separators.color ? separators.color : 'black';
                this.context.font = fontFamily.x && fontSize.x ? '' + fontSize.x + 'px ' + fontFamily.x : '10px Arial';
                this.context.align = "center";

                for (let h = offset.x + distance.x; h < params.labels.horizontal.length * distance.x + offset.x*2; h += distance.x) {
                    pos_x.push([h, offset.y]);
                }

                for (let el = 0; el < params.labels.horizontal.length; el++) {
                    if (pos_x[el] && pos_x[el][1]) {
                        this.context.save();
                        this.context.setTransform(1, 0, 0, 1, 0, 0);
                        this.context.fillText(params.labels.horizontal[el], pos_x[el][0] - this.context.measureText(params.labels.horizontal[el]).width/2, this.height - pos_x[el][1] + offset.y/2 + fontSize.x);
                        this.context.restore();
                    }
                }
            }

            this.context.closePath();
            this.context.stroke();
            this.context.restore();
        } 
        else {
            this.error("You need to set correct \"labels\" parameter!");
        }
    }

    getOffset () {
        return this.offset;
    }

    getLineWidth () {
        return this.lineWidth;
    }

    getWidth () {
        return this.width;
    }

    getHeight () {
        return this.height;
    }

    getTextMetrix (txt) {
        if (typeof txt === "string") return this.context.measureText(txt);
    }
}
//this.context.font = size + "px " + type;

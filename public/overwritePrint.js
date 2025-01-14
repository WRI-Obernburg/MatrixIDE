window.output = "";



var Module = {
    print: function (message) {
        window.output += message + '\n'; // Append each output to the `output` variable
        console.log(message + '\n');
    }
}
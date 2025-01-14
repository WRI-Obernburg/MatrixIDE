
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {useState} from "react";

const examples = [
    
{
    "name": "Racing Game",
    "code": "\n" +
        "\n" +
        "var roadpieces[12][13];\n" +
        "var is_on[12];\n" +
        "var car_x = 6;\n" +
        "var car_y = 2;\n" +
        "var ref_point = 4;\n" +
        "var keep_state = 2;\n" +
        "var loop_counter = 0;\n" +
        "var points = 0;\n" +
        "var loose_state = false;\n" +
        "var distance;\n" +
        "\n" +
        "function init() {\n" +
        "    reset();\n" +
        "    set_controls(0b00001010);\n" +
        "}\n" +
        "\n" +
        "function game_loop() {\n" +
        "    \n" +
        "    if (loose_state) return;\n" +
        "    points++;\n" +
        "    if (is_animation_running()) return;\n" +
        "    set_tps(get_current_tps() + 0.013 / (get_current_tps() / 10));\n" +
        "    set_status(str::format(\"Points: %d\", points));\n" +
        "    if (keep_state < 0 && random(0, 10) > 4) {\n" +
        "        if (random(0, 9) > 4) {\n" +
        "            if (ref_point > 0) {\n" +
        "                ref_point--;\n" +
        "                keep_state = 7;\n" +
        "            }\n" +
        "        } else {\n" +
        "            if (ref_point < 6) {\n" +
        "                ref_point++;\n" +
        "                keep_state = 7;\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "    keep_state--;\n" +
        "\n" +
        "    for (var y = 0; y < 12; y++) {\n" +
        "        for (var x = 0; x < 12; x++) {\n" +
        "            roadpieces[x][y] = roadpieces[x][y + 1];\n" +
        "        }\n" +
        "    }\n" +
        "\n" +
        "    for (var i = 0; i < 12; i++) {\n" +
        "        roadpieces[i][12] = false;\n" +
        "    }\n" +
        "\n" +
        "    roadpieces[ref_point][12] = true;\n" +
        "\n" +
        "    if (points > 300) {\n" +
        "        distance = 4;\n" +
        "    } else {\n" +
        "        distance = 5;\n" +
        "    }\n" +
        "    roadpieces[ref_point + distance][12] = true;\n" +
        "\n" +
        "    if (loop_counter >= 3) {\n" +
        "        loop_counter = 0;\n" +
        "    }\n" +
        "\n" +
        "    for (var i = 0; i < 12; i++) {\n" +
        "        is_on[i] = false;\n" +
        "        if ((i + loop_counter) % 3 == 0) {\n" +
        "            is_on[i] = true;\n" +
        "        }\n" +
        "    }\n" +
        "    loop_counter++;\n" +
        "\n" +
        "    if (roadpieces[car_x][car_y] || roadpieces[car_x][car_y + 1]) {\n" +
        "        loose_state = true;\n" +
        "        set_controls(0b00100000);\n" +
        "        run_animation_splash(car_x, car_y, 0xFF0000, true, 1000, 1000);\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "function draw() {\n" +
        "    if (is_animation_running()) return;\n" +
        "\n" +
        "    if (loose_state) {\n" +
        "        clear();\n" +
        "        number(1, 4, points, 0xFF0000);\n" +
        "        return;\n" +
        "    }\n" +
        "\n" +
        "    for (var y = 0; y < 12; y++) {\n" +
        "        for (var x = 0; x < 12; x++) {\n" +
        "            if (roadpieces[x][y]) {\n" +
        "                if (is_on[y]) {\n" +
        "                    set(x, y, 0x00FF00);\n" +
        "                } else {\n" +
        "                    set(x, y, 0xFFFFFF);\n" +
        "                }\n" +
        "            } else {\n" +
        "                off(x, y);\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "\n" +
        "    set(car_x, car_y, 0xFFFF00);\n" +
        "    set(car_x, car_y + 1, 0xFFFF00);\n" +
        "}\n" +
        "\n" +
        "function clean_up() {\n" +
        "}\n" +
        "\n" +
        "function on_event(event) {\n" +
        "    if (event == 2) {\n" +
        "        if (car_x > 0) {\n" +
        "            car_x--;\n" +
        "          }\n" +
        "    }\n" +
        "\n" +
        "\n" +
        "    if (event == 3) {\n" +
        "        if (car_x < 11) {\n" +
        "            car_x++;\n" +
        "          }\n" +
        "\n" +
        "    }\n" +
        "\n" +
        "    if (event == 5) {\n" +
        "        loose_state = false;\n" +
        "        reset();\n" +
        "        set_controls(0b00001010);\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "function reset() {\n" +
        "    car_x = 5;\n" +
        "    car_y = 2;\n" +
        "    ref_point = 4;\n" +
        "    keep_state = 2;\n" +
        "    loop_counter = 0;\n" +
        "    points = 0;\n" +
        "\n" +
        "    for (var x = 0; x < 12; x++) {\n" +
        "        for (var y = 0; y < 13; y++) {\n" +
        "            roadpieces[x][y] = y == 12 && (x <= ref_point || x >= ref_point + 5);\n" +
        "        }\n" +
        "    }\n" +
        "\n" +
        "    for (var i = 0; i < 12; i++) {\n" +
        "        is_on[i] = false;\n" +
        "    }\n" +
        "    set_tps(10);\n" +
        "}"

},

{
    "name": "Snake",
    "code": "\n" +
        " var snake_x[];\n" +
        " var snake_y[];\n" +
        " var direction = -1;\n" +
        " var loose_state = false;\n" +
        " var food_x = 0;\n" +
        " var food_y = 0;\n" +
        "\n" +
        "function reset() {\n" +
        "    list::clear(snake_x);\n" +
        "    list::clear(snake_y);\n" +
        "    list::push_back(snake_x, 1);\n" +
        "    list::push_back(snake_x, 2);\n" +
        "    list::push_back(snake_x, 3);\n" +
        "    list::push_back(snake_y, 5);\n" +
        "    list::push_back(snake_y, 5);\n" +
        "    list::push_back(snake_y, 5);\n" +
        "    food_x = random(0,11);\n" +
        "    food_y = random(0,11);\n" +
        "    set_controls(0b00011011);\n" +
        "    loose_state = false;\n" +
        "    direction = -1;\n" +
        "}\n" +
        "\n" +
        "// Wird einmal beim Start deines Spiels aufgerufen\n" +
        "function init() {\n" +
        "    set_tps(2);\n" +
        "    reset();\n" +
        "}\n" +
        "\n" +
        "// Wird während deines Spiels mit den Ticks pro Sekunde (tps) aufgerufen\n" +
        "function game_loop() {\n" +
        "    if(is_animation_running() || loose_state) {\n" +
        "        return;\n" +
        "    }\n" +
        "\n" +
        "    if(direction == 0) {\n" +
        "        list::push_back(snake_x, snake_x[list::count(snake_x) - 1]);\n" +
        "        list::push_back(snake_y, snake_y[list::count(snake_y) - 1]+1);\n" +
        "    }\n" +
        "\n" +
        "    if(direction == 1) {\n" +
        "        list::push_back(snake_x, snake_x[list::count(snake_x) - 1]+1);\n" +
        "        list::push_back(snake_y, snake_y[list::count(snake_y) - 1]);\n" +
        "    }\n" +
        "\n" +
        "    if(direction == 2) {\n" +
        "        list::push_back(snake_x, snake_x[list::count(snake_x) - 1]);\n" +
        "        list::push_back(snake_y, snake_y[list::count(snake_y) - 1] - 1);\n" +
        "    }\n" +
        "\n" +
        "    if(direction == 3) {\n" +
        "        list::push_back(snake_x, snake_x[list::count(snake_x) - 1] - 1);\n" +
        "        list::push_back(snake_y, snake_y[list::count(snake_y) - 1]);\n" +
        "    }\n" +
        "\n" +
        "    var head_x = snake_x[list::count(snake_x) - 1];\n" +
        "    var head_y = snake_y[list::count(snake_y) - 1];\n" +
        "      \n" +
        "\n" +
        "    // Check for collision with the body\n" +
        "    for (var i = 0; i < list::count(snake_x) - 1; i++) {\n" +
        "        if (snake_x[i] == head_x && snake_y[i] == head_y) {\n" +
        "            loose_state = true;\n" +
        "            set_controls(0b00100000);  // Disable controls when loose\n" +
        "            run_animation_splash(head_x, head_y, 0xFF0000, true, 1000, 1000);  // Show crash animation\n" +
        "            return;\n" +
        "        }\n" +
        "    }\n" +
        "\n" +
        "     // Check if snake is out of bounds\n" +
        "    if (head_x < 0 || head_x > 11 || head_y < 0 || head_y > 11) {\n" +
        "        loose_state = true;\n" +
        "        set_controls(0b00100000);  // Disable controls when loose\n" +
        "        run_animation_splash(head_x, head_y, 0xFF0000, true, 1000, 1000);  // Show crash animation\n" +
        "        return;\n" +
        "    }\n" +
        "\n" +
        "    var food_collision = (head_x == food_x) && (head_y == food_y);\n" +
        "\n" +
        "\n" +
        "        if (direction != -1 && !food_collision)\n" +
        "        {\n" +
        "            list::pop(snake_x);\n" +
        "            list::pop(snake_y);\n" +
        "        }\n" +
        "        \n" +
        "        if (food_collision)\n" +
        "        {\n" +
        "            food_x = random(0, 11);\n" +
        "            food_y = random(0, 11);\n" +
        "        }\n" +
        "\n" +
        "}\n" +
        "\n" +
        "// Wird 30 mal pro Sekunde aufgerufen, um dein Spiel zu zeichnen\n" +
        "function draw() {\n" +
        "    if(is_animation_running()) {\n" +
        "        return;\n" +
        "    }\n" +
        "\n" +
        "    clear();\n" +
        "\n" +
        "    if(loose_state) {\n" +
        "        number(1, 4, list::count(snake_x) - 1, 0xFF0000);\n" +
        "        return;\n" +
        "    }\n" +
        "\n" +
        "    for(var i=0;i<list::count(snake_x);i++) {\n" +
        "        set(snake_x[i], snake_y[i], 0x00FF00);\n" +
        "    }\n" +
        "\n" +
        "    set(food_x, food_y, 0xFF0000);\n" +
        "}\n" +
        "\n" +
        "// Wird beim Beenden deines Spiels aufgerufen\n" +
        "function clean_up() {\n" +
        "\n" +
        "}\n" +
        "\n" +
        "// Wird bei einer Nutzereingabe aufgerufen\n" +
        "function on_event(event) {\n" +
        "\n" +
        "    if(event == 0) { //UP\n" +
        "        direction = 0;\n" +
        "    }\n" +
        "\n" +
        "     if(event == 1) { //DOWN\n" +
        "        direction = 2;\n" +
        "    }\n" +
        "\n" +
        "    if(event == 2) { //LEFT\n" +
        "        direction = 3;\n" +
        "    }\n" +
        "\n" +
        "    if(event == 3) { //RIGHT\n" +
        "        direction = 1;\n" +
        "    }\n" +
        "\n" +
        "    if(event == 5) {\n" +
        "        reset();\n" +
        "    }\n" +
        "\n" +
        "}\n" +
        "\n",
},

{
    "name": "Referenz",
    "code": "\n" +
        "    \n" +
        "// Wird einmal beim Start deines Spiels aufgerufen\n" +
        "function init() {\n" +
        "    print(\"Test Ausgabe\");\n" +
        "    \n" +
        "    var punkte = 4;\n" +
        "    set_status(str::format(\"Deine Punkte %d\", punkte));\n" +
        "\n" +
        "    var status = get_status();\n" +
        "\n" +
        "    set_controls(0b00000001);\n" +
        "\n" +
        "    var controls = get_controls();\n" +
        "\n" +
        "    set_tps(10);\n" +
        "\n" +
        "    reset_controls();\n" +
        "\n" +
        "    if(is_animation_running()) {\n" +
        "        return;\n" +
        "    }\n" +
        "\n" +
        "    stop_animation();\n" +
        "\n" +
        "}\n" +
        "\n" +
        "// Wird während deines Spiels mit den Ticks pro Sekunde (tps) aufgerufen\n" +
        "function game_loop() {\n" +
        "\n" +
        "}\n" +
        "\n" +
        "// Wird 30 mal pro Sekunde aufgerufen, um dein Spiel zu zeichnen\n" +
        "function draw() {\n" +
        "\n" +
        "    //x, y, color\n" +
        "    set(3, 4, 0xFF0000);\n" +
        "\n" +
        "    //x, y\n" +
        "    off(4, 5);\n" +
        "\n" +
        "    //color\n" +
        "    fill(0xFFFF00);\n" +
        "\n" +
        "    //x1, y1, x2, y2, color\n" +
        "    line(1, 1, 5, 5, 0xFFAA00);\n" +
        "\n" +
        "    //x1, y1, width, height, color\n" +
        "    rect(1,1,3,3,0x0000FF);\n" +
        "\n" +
        "    //x1, y1, width, height, color\n" +
        "    rect_filled(1,1,3,3, 0x00FF00);\n" +
        "\n" +
        "    //x, y, radius, color\n" +
        "    circle(3, 4, 3, 0x0000FF);\n" +
        "\n" +
        "    //x, y, n, color\n" +
        "    number(3, 5, 4, 0xFFFFFF);\n" +
        "\n" +
        "    //x, y, color, filled\n" +
        "    run_animation_splash(5, 5, 0xFF0000, true);\n" +
        "\n" +
        "    //from, to\n" +
        "    var zufall = random(1, 10);\n" +
        "}\n" +
        "\n" +
        "// Wird beim Beenden deines Spiels aufgerufen\n" +
        "function clean_up() {\n" +
        "\n" +
        "}\n" +
        "\n" +
        "// Wird bei einer Nutzereingabe aufgerufen\n" +
        "function on_event(event) {\n" +
        "// 0: up, 1: down, 2: left, 3: right, 4: middle, 5: A, 6: B, 7: C\n" +
        "}\n" +
        "\n",
}

];
export default function LoadExamples(props: {onProgramLoad: (code: string)=>void}) {
    const [open, setOpen] = useState(false);

return <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><Button>Examples</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className={"font-bold mb-6"}>Load example</DialogTitle>
      <DialogDescription className="flex flex-col gap-2" asChild>
            <div className="flex flex-col gap-2">
            {
                examples.map((element, i)=>{
                    return <Card onClick={()=>{
                        props.onProgramLoad(element.code);
                        setOpen(false);
                    }} key={i} className="cursor-pointer pl-4 pr-4 flex flex-row justify-between align-middle items-center">
                    
                                <div className="m-4 font-normal">{element.name}</div>

                                <div className="font-bold">{">"}</div>
                          
                    </Card>
                })
            }
            </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

}
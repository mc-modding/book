description: Создание собственной привязки клавиш.

# Привязка клавиш

Создадим класс `TutKeybinds`.

```java
public class TutKeybinds
{
    private static final String catergory = "The My KeyBinds for Mcmodding";
    public static final KeyBinding
            MY_KEY_FIRST = new KeyBinding("key.first", 70, catergory),
            MY_KEY_SECOND = new KeyBinding("key.second", 71, catergory);

    public static void register()
    {
        setRegister(MY_KEY_FIRST);
        setRegister(MY_KEY_SECOND);
    }

    private static void setRegister(KeyBinding binding)
    {
        ClientRegistry.registerKeyBinding(binding);
    }
}
```

* `catergory` - эта переменная отвечает за название категории в которой, будут находится наши бинды клавиш.
* `KeyBinding()` - в этом классе будет создан бинд с именем `ket.*name*`, клавишей `Keyboard.*KEY*` в категории `catergory`.

Так как бинд клавиш относится к клиентской части, нам нужно будет зарегистрировать их в событии FMLClientSetupEvent:
```java
@SubscribeEvent
public static void onClientSetup(FMLClientSetupEvent event)
{
    TutKeybinds.register();
}
```
Не забудте зарегистрировать слушатель!
Переходим в игру и заходим в настройки -> управление.

[!['Бинд клавиш'](images/keybinds.png)](images/keybinds.png) 

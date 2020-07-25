description: Создание собственного предмета, который можно съесть.

# Создание еды

## Основа
При помощи метода food в Properties мы можем сделать предмет едой. Для этого используем Food.Builder():
```java
public class CoconutItem extends Item
{
    public CoconutItem()
    {
        super(new Properties().food(new Food.Builder().build()));
    }
}
```
Food.Builder() Имеет набор параметров:
| Параметр                    | Описание      																														 |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| hunger					  | Отвечает за то сколько голода будет восстановлено.																					 |
| saturation				  | Отвечает за то сколько сытости будет восстановлено.																					 |
| setAlwaysEdible  		  	  | Отвечает за то можно ли есть когда сыт.																								 |
| fastToEat			 	 	  | Отвечает за то быстро ли естся еда.																							 		 |
| effect                      | Добавляет эффект зелья при сьедании. 																		           				 |
| build                       | Собирает билдер. Возвращает Food.																							         |  

Продивинутый пример:
```java
public class CoconutItem extends Item
{
    public CoconutItem()
    {
        super(new Properties().food(
		new Food.Builder()
			.hunger(5)
			.saturation(5)
			.fastToEat()
			.setAlwaysEdible()
			.effect(() -> new EffectInstance(Effects.GLOWING, 10, 10), 10)
			.build()));
    }
}
```       
Теперь когда мы его сьедим нам выдадут эффект свечения, восстановится 5 голода и 5 сытости.
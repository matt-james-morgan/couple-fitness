-- Couple Fitness: seed all 50 recipes
-- Run AFTER schema.sql in the Supabase SQL Editor

TRUNCATE recipes;

INSERT INTO recipes (id, emoji, name, category, tags, prep_time, kcal, protein, carbs, fat, base_servings, ingredients, steps, his_note, her_note, tip) VALUES

-- ── BREAKFAST ─────────────────────────────────────────────────────────────────

('b1','🥚','Scrambled Eggs + GF Toast','breakfast',
 ARRAY['GF','DF','Both'],'10 min',420,30,34,18,1,
 ARRAY['3 large eggs','2 slices Canyon Bakehouse GF bread','1 tsp avocado oil · salt · pepper · hot sauce','Optional: 30g Violife DF cheese shreds','Side: mixed berries or banana'],
 ARRAY['Whisk eggs with salt and pepper. Heat pan on medium-low — low heat = creamy, not rubbery.','Add oil, pour eggs in. Fold gently every 30 sec. Pull off heat just before fully set.','Toast bread, top with eggs. Add cheese if using. Hit with hot sauce.'],
 'Use sourdough. Add regular cheddar. Bump to 4 eggs for +7g protein.',NULL,NULL),

('b2','🌙','Overnight Oat Jars','breakfast',
 ARRAY['GF','DF','Both'],'10 min + overnight',380,22,52,12,1,
 ARRAY['½ cup Bob''s Red Mill certified GF rolled oats','¾ cup unsweetened oat milk','1 scoop DF vanilla protein powder','1 tbsp chia seeds · 1 tbsp PB or almond butter · 1 tsp honey','Fresh berries or banana on top'],
 ARRAY['Combine oats, milk, protein powder, chia, honey in a mason jar. Mix well — protein clumps if undermixed.','Stir in nut butter. Seal and refrigerate overnight (min 4h).','In the morning stir and add fresh toppings. Eat cold or heat 90 sec.'],
 'Use regular oats + 2% milk + Greek yogurt instead of protein powder for more volume.',NULL,NULL),

('b3','🫙','Egg Muffins — Batch Prep','breakfast',
 ARRAY['GF','DF','Both'],'30 min · makes 12',110,10,2,7,6,
 ARRAY['10 large eggs','½ cup oat milk or almond milk','6 strips turkey bacon, cooked & crumbled','½ cup Violife DF cheese shreds','1 cup baby spinach chopped · ½ red pepper diced · salt, pepper, garlic powder, paprika'],
 ARRAY['Preheat oven 375°F. Grease 12-cup muffin tin well or use silicone tin.','Whisk eggs, milk, and all seasonings. Distribute fillings across cups.','Pour egg mix over, filling ¾ full. Bake 18–22 min until golden.','Cool fully. Fridge 5 days or freeze 3 months. Reheat 60 sec in microwave.'],
 'Use regular cheddar. Serve with sourdough or English muffin.','Serve 2–3 muffins with GF toast + fruit. Perfect grab-and-go breakfast.',NULL),

('b4','🍌','Protein Smoothie Bowl','breakfast',
 ARRAY['GF','DF','Both'],'5 min',400,28,48,10,1,
 ARRAY['1 frozen banana + ½ cup frozen mixed berries','1 scoop DF vanilla protein powder','½ cup unsweetened almond milk','Toppings: 1 tbsp almond butter · 2 tbsp GF granola · fresh berries · 1 tbsp chia seeds'],
 ARRAY['Blend frozen fruit with protein powder and just enough milk to blend — keep it thick so toppings sit.','Pour into bowl. Arrange toppings and eat with a spoon, not a straw — chewing triggers more satiety.'],
 NULL,'Check granola label for GF certification. Bob''s Red Mill GF granola works well.',NULL),

('b5','🍠','Sweet Potato & Beef Breakfast Hash','breakfast',
 ARRAY['GF','DF','Both'],'20 min',440,36,38,14,2,
 ARRAY['300g lean ground beef','2 medium sweet potatoes (~450g), cubed small','½ onion + 1 bell pepper, diced · 2 cloves garlic','1 tsp smoked paprika · 1 tsp cumin · salt, pepper, chili flakes','1 fried egg per person on top (+6g protein)'],
 ARRAY['Microwave cubed sweet potato 3–4 min to par-cook.','Cast iron on high. Press sweet potato flat — don''t stir 3 min until crispy. Push to edge.','Brown beef in center with garlic and spices. Add onion and pepper. Stir everything together 3–4 min.','Top each portion with a fried egg. Great cold the next day too.'],
 NULL,'Iron-rich — great during menstrual phase. Make a batch Sunday and reheat all week.',NULL),

('b6','🥞','Banana Oat Protein Pancakes','breakfast',
 ARRAY['GF','DF','Both'],'15 min · makes 6',360,24,44,10,3,
 ARRAY['1 ripe banana, mashed · 2 eggs','½ cup certified GF oats, blended into flour','1 scoop DF vanilla protein powder','¼ tsp baking powder · pinch salt · ½ tsp cinnamon','Topping: berries + small drizzle maple syrup'],
 ARRAY['Blend oats until fine flour. Mix all ingredients until smooth batter.','Medium-low pan, light oil. Pour small rounds. Cook 2–3 min per side until set.','Denser than flour pancakes — don''t flip too early. Top with berries.'],
 NULL,NULL,NULL),

('b7','🫐','Coconut Yogurt Berry Bowl','breakfast',
 ARRAY['GF','DF','Both'],'3 min',310,20,32,10,1,
 ARRAY['200g unsweetened coconut yogurt','1 scoop DF vanilla protein powder, stirred in','1 cup mixed berries (fresh or thawed)','1 tbsp almond butter · 1 tbsp chia seeds · drizzle of honey'],
 ARRAY['Stir protein powder into yogurt first — it blends smoother this way.','Top with berries, almond butter, chia, and honey. Done.'],
 'Use Greek yogurt 2% for more protein. Add granola for extra carbs.','Light and fast. Good option on lower energy days (luteal phase).',NULL),

('b8','🧇','Turkey Bacon Egg Wrap (Rice Paper)','breakfast',
 ARRAY['GF','DF','Both'],'12 min',380,32,28,14,1,
 ARRAY['2 rice paper wrappers (naturally GF)','3 eggs, scrambled · 3 strips turkey bacon, cooked','¼ avocado sliced · handful baby spinach','Hot sauce or GF sriracha'],
 ARRAY['Soak rice paper in warm water 20–30 sec until just pliable — don''t over-soak or it tears.','Layer spinach, scrambled eggs, turkey bacon, avocado on lower third.','Fold sides in, roll tight like a burrito. Hit with hot sauce. Eat immediately.'],
 NULL,NULL,NULL),

('b9','🥜','PB Banana Toast + Protein Shake','breakfast',
 ARRAY['GF','DF','Both'],'5 min',390,26,46,12,1,
 ARRAY['2 slices Canyon Bakehouse GF bread, toasted','2 tbsp natural peanut butter · 1 banana, sliced','Drizzle honey · pinch cinnamon','Side: 1 scoop DF protein shake in water'],
 ARRAY['Toast bread. Spread PB to the edges. Layer banana, drizzle honey, dust cinnamon.','Shake protein separately — the toast alone is low on protein.'],
 'Use sourdough. Add a fried egg on top for +7g protein and skip the shake.',NULL,NULL),

('b10','🍳','Veggie Egg Scramble Bowl','breakfast',
 ARRAY['GF','DF','Both'],'12 min',370,28,22,20,1,
 ARRAY['3 eggs + 2 egg whites','½ cup cherry tomatoes · ½ cup baby spinach · ¼ avocado sliced','30g Violife DF cheese shreds','1 tsp avocado oil · salt · pepper · garlic powder'],
 ARRAY['Sauté tomatoes and spinach in oil 2 min until wilted. Season well.','Add whisked eggs. Fold gently on medium-low — slow heat = creamy.','Top with avocado slices and DF cheese.'],
 'Add regular cheddar. Serve with sourdough toast.',NULL,NULL),

-- ── LUNCH ─────────────────────────────────────────────────────────────────────

('l1','🥣','Crispy Rice Protein Bowl','lunch',
 ARRAY['GF','DF','Both'],'35 min · 5 bowls',480,45,55,10,5,
 ARRAY['750g cooked jasmine rice (refrigerate overnight for crispiness)','700g chicken breast or ground beef','3 tbsp tamari + 2 tbsp sweet chilli + 1 tbsp sesame oil','2 cups roasted mixed veg (zucchini, broccoli, peppers)','Cucumber, sesame seeds, green onion to serve'],
 ARRAY['Use day-old refrigerated rice — key to crispy. Fresh rice just steams.','High heat, avocado oil. Press rice flat, don''t touch 4–5 min until golden.','Season rice with 1 tbsp tamari + sesame oil. Set aside. Cook protein in same pan.','Roast veg 425°F, 20 min. Assemble: crispy rice → protein → veg → cucumber → sesame.'],
 NULL,'Always use tamari — regular soy sauce contains wheat.',NULL),

('l2','🥗','Big Protein Chicken Salad','lunch',
 ARRAY['GF','DF','Both'],'25 min · 4 servings',380,44,18,16,4,
 ARRAY['600g chicken breast, grilled and sliced','Large bag mixed greens · 1 English cucumber · 1 cup cherry tomatoes · ½ red onion','1 avocado, cubed fresh when eating','Dressing: 3 tbsp olive oil + 2 tbsp lemon + 1 tsp Dijon + 1 tsp honey + salt'],
 ARRAY['Season and grill chicken with garlic powder, paprika, salt. Rest 5 min then slice.','Whisk dressing. Keep separate until serving to avoid sogginess. Add avocado fresh.'],
 'Croutons or sourdough side. Parmesan shavings.',NULL,NULL),

('l3','🌮','Tuna Salad Rice Wraps','lunch',
 ARRAY['GF','DF','Both'],'15 min · 4 servings',380,40,35,12,4,
 ARRAY['4 cans tuna in water (170g each), drained','3 tbsp Primal Kitchen avocado mayo','2 tsp Dijon · ½ red onion diced · 2 stalks celery diced · lemon juice','8 rice paper wrappers OR large lettuce cups','Cucumber, avocado, cherry tomatoes to fill'],
 ARRAY['Mix tuna with mayo, Dijon, red onion, celery, lemon. Season well.','Soak rice paper 30 sec in warm water until pliable. Fill and roll tight.','Store tuna mix separately — assemble fresh to avoid sogginess.'],
 'Tuna melt on sourdough with cheddar. Same tuna base — just grill it.',NULL,NULL),

('l4','🥘','Chicken & Potato Stir Fry','lunch',
 ARRAY['GF','DF','Both'],'35 min · 5 servings',460,40,48,10,5,
 ARRAY['600g chicken breast cubed · 600g baby potatoes halved, par-boiled 10 min','2 bell peppers sliced · 1 cup snap peas','Sauce: 3 tbsp tamari + 1 tbsp sesame oil + 2 tbsp sweet chilli + ginger + garlic + 1 tbsp cornstarch'],
 ARRAY['Par-boil potatoes 10 min. Mix sauce. Pan-fry potatoes on high until crispy ~5 min.','Add chicken, cook 5–6 min. Add veg, stir fry 2 min. Pour sauce. Toss 2 min until glossy.','Top with green onion and sesame seeds.'],
 NULL,'Potatoes replace noodles — naturally GF and filling.',NULL),

('l5','🥙','Ground Beef Taco Bowl','lunch',
 ARRAY['GF','DF','Both'],'20 min',480,42,44,16,2,
 ARRAY['400g lean ground beef','1 tsp cumin + 1 tsp chili powder + ½ tsp paprika + ½ tsp garlic powder + salt','240g cooked brown rice · ½ cup black beans · ½ cup corn','Toppings: shredded lettuce, cherry tomatoes, ½ avocado, hot sauce, lime'],
 ARRAY['Brown beef with all taco seasoning. Add splash of water. Cook 8 min.','Warm beans and corn in same pan last 2 min.','Bowl: rice → beef & beans → toppings → hot sauce & lime.'],
 NULL,NULL,NULL),

('l6','🐟','Salmon Avocado Rice Bowl','lunch',
 ARRAY['GF','DF','Both'],'20 min',490,42,40,18,1,
 ARRAY['180g salmon fillet · 120g cooked jasmine rice','½ avocado · cucumber slices · shredded purple cabbage','Sauce: 1 tbsp tamari + 1 tsp sesame oil + ½ tsp rice vinegar + sriracha to taste'],
 ARRAY['Season salmon with salt and sesame oil. Cook skin-side down 4 min, flip 2–3 min more.','Flake salmon over rice. Arrange avocado, cucumber, cabbage around it.','Drizzle sauce. Top with sesame seeds and green onion.'],
 NULL,NULL,NULL),

('l7','🍲','Turkey & Veggie Lettuce Cups','lunch',
 ARRAY['GF','DF','Both'],'20 min',350,38,22,12,2,
 ARRAY['400g lean ground turkey','Sauce: 2 tbsp tamari + 1 tbsp sesame oil + 1 tbsp sweet chilli + garlic + ginger','1 cup shredded carrots · ½ cup water chestnuts (canned)','8 large butter or romaine lettuce leaves','Garnish: green onion, sesame seeds, lime wedge'],
 ARRAY['Brown turkey in sesame oil with garlic and ginger. Break up well.','Add carrots and water chestnuts. Stir fry 2 min. Pour sauce. Toss 1 min more.','Spoon into lettuce cups. Top with green onion, sesame, squeeze of lime.'],
 NULL,NULL,NULL),

('l8','🫙','Mason Jar Chicken Soup','lunch',
 ARRAY['GF','DF','Both'],'30 min · 4 servings',340,38,28,8,4,
 ARRAY['600g chicken breast · 1.5L GF chicken stock','2 carrots + 3 stalks celery + 1 onion diced · 2 cloves garlic · 1 tsp thyme · bay leaf','150g GF pasta or rice noodles'],
 ARRAY['Simmer chicken in stock with all veg and thyme 20 min. Remove chicken, shred, return to pot.','Cook GF pasta or rice noodles in the soup the last 8 min.','Season well. Portion into mason jars — keeps 5 days.'],
 NULL,NULL,NULL),

('l9','🌯','Chicken Caesar Rice Wrap (No-Dairy)','lunch',
 ARRAY['GF','DF','Both'],'15 min',430,40,38,14,1,
 ARRAY['150g grilled chicken breast, sliced · 2 large rice paper wrappers','2 cups romaine, chopped','DF Caesar: 2 tbsp avocado mayo + 1 tsp Dijon + ½ tsp garlic powder + lemon + anchovy paste (opt)','Nutritional yeast as parmesan substitute'],
 ARRAY['Mix DF Caesar dressing. Adjust lemon for brightness.','Toss romaine with dressing. Soak rice papers until pliable.','Add dressed romaine and chicken. Dust with nutritional yeast. Roll tight.'],
 NULL,NULL,NULL),

('l10','🥬','Asian Beef & Noodle Jar','lunch',
 ARRAY['GF','DF','Both'],'20 min · prep ahead',450,40,50,10,2,
 ARRAY['400g lean ground beef or chicken, cooked','200g rice noodles, cooked and cooled','Sauce: 2 tbsp tamari + 1 tbsp sesame oil + 1 tbsp sweet chilli + ginger + garlic','1 cup shredded cabbage · 1 cup edamame · shredded carrots'],
 ARRAY['Cook and cool noodles. Toss with sesame oil to prevent sticking.','Layer in mason jar: noodles → protein → veg → sauce on top.','Shake to dress when eating. Add lime and sesame seeds fresh.'],
 NULL,NULL,NULL),

-- ── DINNER ─────────────────────────────────────────────────────────────────────

('d1','🍝','Turkey Bacon GF Pasta Bake','dinner',
 ARRAY['GF','DF','Both'],'45 min · 5 servings',520,42,52,16,5,
 ARRAY['400g Barilla GF penne · 8 strips turkey bacon, chopped','500g lean ground turkey or chicken','1 can (400ml) coconut cream · 1 tbsp nutritional yeast','3 cloves garlic · 1 bag baby spinach · salt, pepper, Italian seasoning, olive oil'],
 ARRAY['Cook pasta 2 min under package time. Drain and set aside.','Crisp turkey bacon, set aside. Brown ground turkey with garlic and seasoning.','Add coconut cream + nutritional yeast, simmer 3 min. Stir in spinach, pasta, bacon.','Bake 375°F for 20 min until bubbling. Portion into 5 containers.'],
 'Sprinkle parmesan before baking. Use regular pasta if preferred.',NULL,NULL),

('d2','🌶️','Ground Beef & Bean Chili','dinner',
 ARRAY['GF','DF','Both'],'40 min · 6 servings',430,38,40,12,6,
 ARRAY['700g lean ground beef (90/10)','1 can kidney beans + 1 can black beans, drained','2 cans tomatoes · 1 onion diced · 3 cloves garlic','2 tbsp chili powder · 1 tsp cumin · 1 tsp smoked paprika','½ cup GF beef stock'],
 ARRAY['Brown beef with onion and garlic. Drain fat.','Add all spices, stir 1 min to bloom. Add tomatoes + stock and beans.','Bring to boil, simmer 35 min. Adjust seasoning.','Serve over brown rice or with GF crackers.'],
 'Sour cream + cheddar on top. Serve with sourdough or cornbread.',NULL,NULL),

('d3','🐟','Sheet Pan Salmon + Sweet Potato','dinner',
 ARRAY['GF','DF','Both'],'30 min · 4 servings',450,46,28,18,4,
 ARRAY['4 salmon fillets (~180g each)','2 large sweet potatoes cubed · 2 cups broccoli + 1 zucchini sliced','3 tbsp olive oil · lemon · salt, pepper, paprika','Glaze: 2 tbsp tamari + 1 tbsp honey + 1 tsp garlic powder'],
 ARRAY['Preheat oven 425°F. Roast cubed sweet potato 15 min first.','Brush salmon with tamari-honey glaze. Add salmon and veg to pans.','Roast 15–18 min until salmon flakes. Squeeze fresh lemon over everything.'],
 NULL,NULL,NULL),

('d4','🍲','Coconut Chicken Curry + Rice','dinner',
 ARRAY['GF','DF','Both'],'35 min · 4 servings',510,44,48,16,4,
 ARRAY['600g chicken breast, cubed','1 can (400ml) coconut cream','2 tbsp GF curry powder · 1 tsp turmeric · 1 tsp ginger paste','1 onion diced · 3 cloves garlic · 1 can diced tomatoes · 1 cup frozen peas','240g cooked jasmine rice · fresh cilantro'],
 ARRAY['Sauté onion and garlic until soft. Add curry powder, turmeric, ginger — stir 1 min to bloom.','Add chicken, sear 2–3 min. Pour in coconut cream and tomatoes. Simmer 20 min.','Add peas last 3 min. Serve over rice with fresh cilantro.'],
 NULL,NULL,NULL),

('d5','🥩','Beef & Broccoli Stir Fry + Rice','dinner',
 ARRAY['GF','DF','Both'],'25 min',490,44,46,14,2,
 ARRAY['400g lean beef sirloin or ground beef · 3 cups broccoli florets','Sauce: 3 tbsp tamari + 1 tbsp sesame oil + 1 tbsp honey + 2 tsp cornstarch + garlic + ginger','240g cooked jasmine rice · sesame seeds + green onion'],
 ARRAY['Mix sauce. Sear beef on high heat 2–3 min until brown but tender. Remove.','Stir fry broccoli 3 min until bright green and tender-crisp.','Return beef, pour sauce. Toss 1–2 min until glossy. Serve over rice.'],
 NULL,NULL,NULL),

('d6','🍠','Turkey-Stuffed Sweet Potatoes','dinner',
 ARRAY['GF','DF','Both'],'50 min · 4 servings',440,38,46,12,4,
 ARRAY['4 large sweet potatoes · 500g lean ground turkey','1 can black beans, drained · ½ cup corn','1 tsp cumin + 1 tsp smoked paprika + ½ tsp chili powder + salt + garlic','Toppings: avocado, hot sauce, fresh cilantro, lime'],
 ARRAY['Bake sweet potatoes 400°F for 45 min (or microwave 8–10 min, pierce first).','Brown turkey with all spices. Add beans and corn, heat through.','Split potatoes, fluff inside, fill with turkey mix. Top with avocado, hot sauce, cilantro, lime.'],
 NULL,NULL,NULL),

('d7','🍋','Lemon Herb Baked Chicken + Roast Veg','dinner',
 ARRAY['GF','DF','Both'],'35 min · 4 servings',410,48,28,12,4,
 ARRAY['4 chicken breasts (~700g)','2 lemons (zest + juice) · 3 cloves garlic minced · 2 tbsp olive oil','1 tsp dried oregano · 1 tsp dried thyme · salt, pepper','2 cups mixed veg: zucchini, cherry tomatoes, bell pepper, asparagus'],
 ARRAY['Marinate chicken in lemon zest, juice, garlic, olive oil, and herbs — 30 min or overnight.','Preheat oven 400°F. Arrange chicken on sheet pan, surround with oiled veg.','Bake 25–28 min until internal temp 165°F. Rest 5 min before slicing.'],
 NULL,'Naturally compliant. Add extra roast sweet potato to hit carb targets.',NULL),

('d8','🥗','Deconstructed Spring Roll Bowl','dinner',
 ARRAY['GF','DF','Both'],'25 min',420,36,44,12,2,
 ARRAY['400g shrimp or ground chicken/turkey','200g rice vermicelli noodles','2 cups shredded cabbage + 1 cup carrots + cucumber','Sauce: 2 tbsp tamari + 1 tbsp lime juice + 1 tsp honey + sriracha + garlic','Fresh mint, cilantro, sesame seeds'],
 ARRAY['Soak rice vermicelli in boiling water 3–4 min. Drain and rinse cold.','Cook protein with garlic, salt, pepper, 1 tsp sesame oil.','Assemble: noodles → protein → raw veg → fresh herbs → drizzle sauce. Toss and eat.'],
 NULL,NULL,NULL),

('d9','🫘','Smoky Black Bean & Chicken Skillet','dinner',
 ARRAY['GF','DF','Both'],'25 min',470,46,42,12,2,
 ARRAY['400g chicken breast, cubed','1 can black beans, drained · ½ cup corn','1 red onion + 2 bell peppers, diced','2 tsp smoked paprika · 1 tsp cumin · ½ tsp chili powder · salt, garlic','2 tbsp olive oil · lime, fresh cilantro, optional avocado'],
 ARRAY['Season chicken. Sear on high heat until golden, 3–4 min per side. Set aside.','Sauté onion and pepper 3 min. Add beans and corn, heat through.','Return sliced chicken. Toss everything. Finish with lime and cilantro.'],
 NULL,NULL,NULL),

('d10','🍜','Chicken Pho-Style Noodle Soup','dinner',
 ARRAY['GF','DF','Both'],'30 min',380,40,36,8,2,
 ARRAY['400g chicken breast, thinly sliced · 1L GF chicken stock','200g rice noodles','1 tbsp fish sauce (GF) + 1 tsp ginger paste + garlic + star anise (opt)','Toppings: bean sprouts, Thai basil, lime, sliced jalapeño, green onion'],
 ARRAY['Simmer stock with fish sauce, ginger, garlic, star anise 10 min to build flavour.','Cook rice noodles in the broth the last 4 min.','Add thinly sliced raw chicken to hot broth — it cooks in 2–3 min. Serve immediately with all toppings.'],
 NULL,NULL,NULL),

-- ── SNACKS ─────────────────────────────────────────────────────────────────────

('s1','🦃','Turkey Sticks + Apple + Almond Butter','snack',
 ARRAY['GF','DF','Both'],'0 min',220,16,22,8,1,
 ARRAY['2–3 Chomps or Archer turkey sticks','1 medium apple, sliced','1 tbsp almond butter for dipping'],
 ARRAY[]::TEXT[],
 NULL,'Fast, portable, satisfying. Protein + fat keeps hunger stable 2–3 hrs.',NULL),

('s2','🥒','Cucumber + Guacamole + Rice Cakes','snack',
 ARRAY['GF','DF','Both'],'5 min',180,4,22,10,1,
 ARRAY['1 English cucumber, sliced · 3–4 Lundberg rice cakes','½ avocado mashed with lime + salt','Optional: GF salsa, hot sauce, everything bagel seasoning'],
 ARRAY[]::TEXT[],
 NULL,'Low protein — pair with a turkey stick or handful of edamame to boost.',NULL),

('s3','🫙','DF Yogurt + Berries + Chia','snack',
 ARRAY['GF','DF','Both'],'2 min',200,14,22,6,1,
 ARRAY['150g unsweetened coconut yogurt','½ scoop DF vanilla protein powder (optional)','½ cup mixed berries · 1 tbsp chia seeds · drizzle of honey'],
 ARRAY[]::TEXT[],
 'Use Greek yogurt 2% for ~22g protein without the protein powder.',NULL,NULL),

('s4','🥜','Hard-Boiled Eggs + PB Rice Cakes','snack',
 ARRAY['GF','DF','Both'],'12 min · batch boil',250,18,18,12,1,
 ARRAY['2 hard-boiled eggs (batch boil 6 on Sunday)','2 rice cakes · 1 tbsp natural peanut butter','Salt + pepper + hot sauce on eggs'],
 ARRAY['Cover eggs in cold water, bring to boil. Turn off heat, lid on, 10 min. Ice bath 5 min. Peel and fridge 5 days.'],
 NULL,NULL,NULL),

('s5','🧃','Protein Shake + Banana','snack',
 ARRAY['GF','DF','Both'],'2 min',280,28,34,4,1,
 ARRAY['1 scoop DF vanilla or chocolate protein powder','300ml cold water or unsweetened almond milk','1 medium banana alongside'],
 ARRAY[]::TEXT[],
 NULL,'Great post-workout if you can''t eat a full meal within 30 min.',NULL),

('s6','🫑','Veggies + Hummus + Turkey Slices','snack',
 ARRAY['GF','DF','Both'],'5 min',230,20,18,8,1,
 ARRAY['1 cup raw veg: bell pepper strips, cucumber, celery, snap peas','4 tbsp hummus (check GF label) · 4–5 slices deli turkey breast'],
 ARRAY[]::TEXT[],
 NULL,NULL,NULL),

('s7','🍫','Dark Chocolate + Mixed Nuts + Berries','snack',
 ARRAY['GF','DF','Both'],'0 min',240,6,20,16,1,
 ARRAY['2 squares (20g) dark chocolate 70%+ — Enjoy Life or Lindt 85%','25g mixed nuts (almonds, walnuts, cashews)','½ cup fresh strawberries or mixed berries'],
 ARRAY[]::TEXT[],
 NULL,'Magnesium from dark chocolate + nuts reduces PMS and luteal phase cravings. Not a guilty snack — a strategic one.',NULL),

('s8','🫐','Edamame + Sea Salt','snack',
 ARRAY['GF','DF','Both'],'5 min',190,17,14,8,1,
 ARRAY['1 cup (155g) shelled edamame — frozen is fine, microwave 3 min','Flaky sea salt · optional: sesame oil drizzle + sesame seeds'],
 ARRAY[]::TEXT[],
 NULL,'Plant protein hit. Good when you want something warm and satisfying without cooking anything real.',NULL),

('s9','🍕','Rice Cake "Pizza" Snack','snack',
 ARRAY['GF','DF','Both'],'5 min',200,14,22,6,1,
 ARRAY['3 rice cakes','2 tbsp GF marinara · 30g Violife DF mozzarella shreds','4–5 slices turkey pepperoni (check GF label) · Italian seasoning, chili flakes'],
 ARRAY['Spread marinara on rice cakes. Top with DF cheese, turkey pepperoni, seasoning.','Broil 2–3 min until cheese melts. Or microwave 45 sec.'],
 NULL,NULL,NULL),

('s10','🌰','London Fog + Turkey Sticks','snack',
 ARRAY['GF','DF','Both'],'5 min',195,14,18,7,1,
 ARRAY['1 Earl Grey tea bag brewed strong · 1 tsp vanilla extract · 1 tsp honey','¾ cup oat milk or almond milk, frothed or heated','2–3 turkey sticks alongside'],
 ARRAY['Brew tea strong 3–4 min. Add vanilla and honey. Froth or heat plant milk, pour over.','Pair with turkey sticks for protein. Keep to 1/day max — it adds up fast at 200+ kcal.'],
 NULL,'London fogs are 200–250 kcal each. Keep to 1/day and count it.',NULL),

-- ── PRE-WORKOUT ─────────────────────────────────────────────────────────────────

('p1','🍌','Banana + Rice Cake + Almond Butter','preworkout',
 ARRAY['GF','DF','Both'],'2 min · 60–90 min before',260,8,44,7,1,
 ARRAY['1 banana · 2 rice cakes · 1 tbsp almond butter'],
 ARRAY[]::TEXT[],
 NULL,NULL,
 '{"label":"Why this works","text":"Fast-digesting carbs (banana) + slow carbs (rice cake) = sustained energy. Eat 60–90 min before lifting, 30–45 min before runs.","gender":"m"}'::JSONB),

('p2','🍝','GF Pasta + Marinara + Turkey (Small)','preworkout',
 ARRAY['GF','DF','Both'],'15 min · 90–120 min before',380,26,52,8,1,
 ARRAY['120g dry GF penne (Barilla), cooked','½ cup GF marinara sauce · 100g ground turkey or chicken, browned','Salt, Italian seasoning, garlic powder'],
 ARRAY[]::TEXT[],
 'Use regular pasta. Top with parmesan. Scale to 150g dry pasta for heavier training days.',NULL,NULL),

('p3','🍚','Chicken + White Rice Bowl (Small)','preworkout',
 ARRAY['GF','DF','Both'],'10 min · 90 min before',350,30,48,5,1,
 ARRAY['120g chicken breast (grilled or leftover) · 150g cooked jasmine rice','1 tbsp tamari + hot sauce'],
 ARRAY[]::TEXT[],
 NULL,NULL,
 '{"label":"White vs brown rice","text":"White rice pre-workout is intentional — it digests faster and won''t sit heavy mid-session. Save brown rice for post-workout recovery meals.","gender":"m"}'::JSONB),

('p4','🥣','Oats + Banana + Honey (Warm)','preworkout',
 ARRAY['GF','DF','Both'],'5 min · 60–75 min before',320,8,62,5,1,
 ARRAY['½ cup certified GF rolled oats','1 cup oat milk or almond milk','1 ripe banana, mashed in · 1 tbsp honey · pinch salt · cinnamon'],
 ARRAY['Microwave oats with milk 2–3 min. Stir in mashed banana, honey, and cinnamon.','Eat 60–75 min before training. High carb, easy to digest.'],
 NULL,NULL,NULL),

('p5','🥐','GF Toast + Honey + Egg White','preworkout',
 ARRAY['GF','DF','Both'],'8 min · 60 min before',280,18,40,4,1,
 ARRAY['2 slices Canyon Bakehouse GF bread','3 egg whites, scrambled · 1 tbsp honey spread on toast · pinch of salt'],
 ARRAY[]::TEXT[],
 NULL,NULL,
 '{"label":"Her pre-lift note","text":"Egg whites over whole eggs keeps fat minimal so energy reaches muscles faster. Low fat pre-workout is intentional.","gender":"f"}'::JSONB),

('p6','🧃','Pre-Run Smoothie (Light)','preworkout',
 ARRAY['GF','DF','Both'],'3 min · 30–45 min before',240,20,36,2,1,
 ARRAY['1 scoop DF vanilla protein powder','1 ripe banana (frozen = creamier) · 1 cup water or light almond milk','No fat, no fibre — keep it light for a run'],
 ARRAY[]::TEXT[],
 NULL,NULL,
 '{"label":"For runs","text":"Avoid fat and fibre before running — they cause GI cramps mid-run. This smoothie is deliberately clean for that reason.","gender":"m"}'::JSONB),

('p7','🍠','Sweet Potato + Chicken (Mini Meal)','preworkout',
 ARRAY['GF','DF','Both'],'5 min · 90 min before',340,32,40,4,1,
 ARRAY['1 medium sweet potato, microwaved (8 min, pierce first)','100g cooked chicken breast · salt + hot sauce'],
 ARRAY[]::TEXT[],
 NULL,NULL,
 '{"label":"Meal prep friendly","text":"Use leftover chicken and a pre-baked sweet potato. Microwave together 90 sec. Ideal carb-protein split for lifting.","gender":"m"}'::JSONB),

('p8','🫐','Berry Oat Energy Bites (Batch)','preworkout',
 ARRAY['GF','DF','Both'],'15 min + chill · makes 12',100,4,14,4,6,
 ARRAY['1 cup certified GF rolled oats','⅓ cup natural peanut butter · 3 tbsp honey','¼ cup mini DF chocolate chips (Enjoy Life)','2 tbsp chia seeds · pinch salt · 1 tsp vanilla'],
 ARRAY['Mix all ingredients — should be sticky. Add a tiny bit more honey if too dry.','Refrigerate 30 min to firm up. Roll into 12 balls.','Store in fridge 2 weeks or freezer 3 months. Grab 2–3 pre-workout.'],
 NULL,NULL,NULL),

('p9','🥛','Protein Shake + Dates','preworkout',
 ARRAY['GF','DF','Both'],'2 min · 30–45 min before',270,26,36,3,1,
 ARRAY['1 scoop DF protein powder in water','3–4 Medjool dates (nature''s fast carb)'],
 ARRAY[]::TEXT[],
 NULL,NULL,
 '{"label":"Why dates","text":"Dates digest fast — they''re nature''s energy gel. Great when you need quick fuel without cooking anything.","gender":"m"}'::JSONB),

('p10','🍞','GF Turkey Sandwich (No Cheese)','preworkout',
 ARRAY['GF','DF','Both'],'5 min · 90 min before',310,26,38,6,1,
 ARRAY['2 slices Canyon Bakehouse GF bread','120g deli turkey breast · 1 tbsp Dijon mustard (GF) + hot sauce','Lettuce, tomato, cucumber · no cheese pre-workout'],
 ARRAY[]::TEXT[],
 'Use sourdough or whole wheat. Add avocado mayo. Scale to 150g turkey + extra bread.',NULL,
 '{"label":"No cheese = intentional","text":"Fat delays gastric emptying 60–90 min. Skipping cheese pre-workout means carbs reach muscles faster.","gender":"f"}'::JSONB);

//
//  GRMainModule.m
//  GroupRight
//
//  Created by Scott on 4/21/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "GRMainModule.h"


GRMainModule *GRMAIN;

@implementation GRMainModule

@synthesize user,ac,events,tasks,updates,messages,groups,groupsDict,contacts,fname,lname;

/* constructor */
+ (GRMainModule *) grMain
{
    if(!GRMAIN){
        GRMAIN = [[GRMainModule alloc] init];
    }
    return GRMAIN;
}

/* loading / parsing data */
- (void) addUserData: (NSDictionary *) raw
{
    // Clear the data.
    //[groups removeAllObjects];
    //[events removeAllObjects];
    //[tasks removeAllObjects];
    //[updates removeAllObjects];
    [self clearData];
    //[messages removeAllObjects];
    
    groups = (NSMutableArray *) [raw objectForKey:@"memberships"];
    
    //messages = (NSMutableArray *) [raw objectForKey:@"messages"];
    
    fname = (NSString *) [raw objectForKey:@"first_name"];
    lname = (NSString *) [raw objectForKey:@"last_name"];
    
    groupsDict = [[NSMutableDictionary alloc] init];
    contacts = [[NSMutableDictionary alloc] init];
    for(int i = 0; i < [groups count]; i++)
    {
        [groupsDict setObject:groups[i] forKey:[groups[i] objectForKey:@"group_id"]];
        NSMutableArray *members = (NSMutableArray *)[groups[i] objectForKey:@"members"];
        for (int j = 0; j < [members count]; j++)
        {
            [contacts setObject:members[j] forKey:[members[j] objectForKey:@"email"]];
        }
    }
    
    
    NSArray *tempEvents = (NSArray *) [raw objectForKey:@"events"];
    events = [[NSMutableArray alloc] init];
    for( int i = 0; i < [tempEvents count]; i++)
    {
        if([tempEvents[i] objectForKey:@"start_time"] != [NSNull null])
        {
            [events addObject:tempEvents[i]];
        }
    }
    
    tasks = [[NSMutableArray alloc] init];
    NSMutableArray* tasks_temp = (NSMutableArray *) [raw objectForKey:@"tasks"];
    for(int i=0; i<[tasks_temp count]; i++){
        NSDictionary *task=[tasks_temp objectAtIndex:i];
        if([[task objectForKey:@"is_completed"] isEqualToString:@"1"]){
            [tasks  addObject:task];
        }
        else{
            [tasks insertObject:task atIndex:0];
        }
    }
    //tasks=[[tasks reverseObjectEnumerator] allObjects];
    updates = (NSMutableArray *) [raw objectForKey:@"updates"];
    
    return;
}
- (void) addMessages:(NSDictionary *)raw{
    if([messages count]){
        [messages removeAllObjects];
    }
    messages= (NSMutableArray*) [raw objectForKey:@"messages"];
}

- (NSString*) getFullNameForEmail:(NSString*) email
{
    NSDictionary *person = (NSDictionary *)[contacts objectForKey:email];
    NSString *name = [NSString stringWithFormat:@"%@ %@", [person objectForKey:@"first_name"],[person objectForKey:@"last_name"]];
    return name;
}
- (UIColor*) getColorForGroupWithId:(NSString*) guid AtAlpha: (float) alpha{
    
    NSString *hexColor = (NSString *)[[groupsDict objectForKey:guid] objectForKey:@"group_color"];
    NSString *rColor = [hexColor substringWithRange:NSMakeRange(1, 2)];
    NSString *gColor = [hexColor substringWithRange:NSMakeRange(3, 2)];
    NSString *bColor = [hexColor substringWithRange:NSMakeRange(5, 2)];
    
    unsigned ri,gi,bi;
    
    NSScanner *scanner = [NSScanner scannerWithString:rColor];
    [scanner scanHexInt:&ri];
    scanner = [scanner initWithString:gColor];
    [scanner scanHexInt:&gi];
    scanner = [scanner initWithString:bColor];
    [scanner scanHexInt:&bi];
    
     float rf,gf,bf;
     rf = ((float) ri)/255.0;
     gf = ((float) gi)/255.0;
     bf = ((float) bi)/255.0;

    
    UIColor *myColor = [UIColor colorWithRed:rf green:gf blue:bf alpha:alpha];
    return myColor;
}

- (UIColor *) getColorForGroupWithId:(NSString *)guid{
    return [self getColorForGroupWithId:guid AtAlpha:0.7f];
}

- (UIColor *) getColorForTaskWithId:(NSString *)task_id{
    NSString* guid;
    for(int i=0; i<[tasks count]; i++){
        if([[[tasks objectAtIndex:i] objectForKey:@"task_uid"] isEqualToString: task_id]){
            guid=[[tasks objectAtIndex:i] objectForKey:@"group_id"];
            break;
        }
    }
    return [self getColorForGroupWithId:guid AtAlpha:1];
}
- (void) setMessagesForGroupWithId:(NSString*) guid{
    //empty the messages array
    if([messages count]){
        [messages removeAllObjects];
    }
    //Replace messages with those messages that correspond to to guid
    
    
    NSDictionary*message1= @{@"content": @"Content 1",
                             @"email":@"zwilson7@gmail.com",
                             @"timestamp":@"2015-02-26 22:00:05 UTC"};
    NSDictionary*message2= @{@"content": @"Content 2",
                             @"email":@"kennethbigler@gmail.com",
                             @"timestamp":@"2015-02-26 22:00:05 UTC"};
    NSDictionary*message3= @{@"content": @"Content 3",
                             @"email":@"zwilson7@gmail.com",
                             @"timestamp":@"2015-02-26 22:00:05 UTC"};
    NSDictionary*message4= @{@"content": @"Content 1",
                             @"email":@"zwilson7@gmail.com",
                             @"timestamp":@"2015-02-26 22:00:05 UTC"};
    NSDictionary*message5= @{@"content": @"Content 2",
                             @"email":@"kennethbigler@gmail.com",
                             @"timestamp":@"2015-02-26 22:00:05 UTC"};
    NSDictionary*message6= @{@"content": @"Content 3",
                             @"email":@"zwilson7@gmail.com",
                             @"timestamp":@"2015-02-26 22:00:05 UTC"};
    
    //populate the array
    messages=[NSMutableArray arrayWithObjects:message1,message2,message3,message4,message5,message6,nil];
}
-(void) clearData{
    [groups removeAllObjects];
    [events removeAllObjects];
    [tasks removeAllObjects];
    [updates removeAllObjects];
}
- (NSString*) getFullNameForGroupWithId:(NSString*)group_id{
    for(int i=0; i<[groups count]; i++){
        if([[[groups objectAtIndex:i] objectForKey:@"group_id"] isEqualToString: group_id]){
            return [[groups objectAtIndex:i] objectForKey:@"group_name"];
        }
    }
    return @"Not Found";
}

@end

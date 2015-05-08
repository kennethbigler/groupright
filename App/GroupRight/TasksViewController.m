//
//  TasksViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "TasksViewController.h"
#import "GRMainModule.h"
#import "LoginViewController.h"
#import "TasksTableViewCell.h"
#import "TaskDetailViewController.h"

@interface TasksViewController ()

@end

@implementation TasksViewController

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/
- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doYourStuff)
                                                 name:UIApplicationWillEnterForegroundNotification object:nil];
    // Do any additional setup after loading the view, typically from a nib.
}
-(void)doYourStuff{
    [_TasksTable reloadData];
}

-(void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}


-(UITableView*) TasksTable{
    return _TasksTable;
}

- (void)viewDidAppear:(BOOL)animated
{
    GRMainModule *grmm = [GRMainModule grMain];
    
    
    if([grmm ac] == nil )
    {
        UIStoryboard *storyboard = self.storyboard;
        
        LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
        [self presentViewController:lvc animated:NO completion:nil];
    }
    //LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
    //[self presentViewController:lvc animated:NO completion:nil];
    [_TasksTable reloadData];
    //NSLog(@"Hello1");
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


// =============================================================================================
//  Tasks Table
// =============================================================================================

- (NSInteger) numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    GRMainModule *grmm = [GRMainModule grMain];
    //NSLog(@"Hello");
    return [grmm.tasks count];
}

- (UITableViewCell *) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    GRMainModule *grmm = [GRMainModule grMain];
    static NSString *cellID = @"TasksCell";
    
    //Get a new or recycled cell
    TasksTableViewCell *cell = (TasksTableViewCell *)[tableView dequeueReusableCellWithIdentifier:cellID];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"TasksTableCell" owner:self options:nil];
        
        cell = (TasksTableViewCell*)[nib objectAtIndex:0];
    }
    
    //Set Name and Description
    NSDictionary *task = [grmm.tasks objectAtIndex: indexPath.row];
    
    
    cell.description.text = [task objectForKey:@"task_title"];
  
    
    UIColor *grColor = [grmm getColorForGroupWithId:[task objectForKey:@"group_id"] AtAlpha:1.0f];
    cell.colorImage.backgroundColor = grColor;
    cell.colorImage.image = nil;
    //cell.statusImage.backgroundColor = grColor;
    CAShapeLayer *circleLayer = [CAShapeLayer layer];
    circleLayer.path = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(0, 0, 30, 30)].CGPath;
    if([[task objectForKey:@"is_completed"] isEqual:@"1"]){
        circleLayer.fillColor = grColor.CGColor;
        circleLayer.strokeColor = [UIColor colorWithRed:.44 green:.44 blue:.44 alpha:1].CGColor;
        circleLayer.lineWidth = 2;
    }
    else{
        circleLayer.fillColor = [UIColor whiteColor].CGColor;
        circleLayer.strokeColor = grColor.CGColor;
        circleLayer.lineWidth = 2;
    }
    //NSLog([task objectForKey:@"link_type"]);
    if(![[task objectForKey:@"link_type"] isEqual:[NSNull null]]){
        [cell.completedButton setAccessibilityValue:@"null"];
    }
    else if([[task objectForKey:@"is_completed"] isEqual:@"1"]){
        [cell.completedButton setAccessibilityValue:@"completed"];
    }
    else{
        [cell.completedButton setAccessibilityValue:[task objectForKey:@"task_uid"]];
    }
    //[cell.completed.layer addSublayer:circleLayer];
    [cell.completedButton.layer addSublayer:circleLayer];
    UIView *bgColorView = [[UIView alloc] init];
    bgColorView.backgroundColor = grColor;
    [cell setSelectedBackgroundView:bgColorView];
                                  
                                  
    //Set the correct photo
    /*if([[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"link_type"] isEqual: @"event"]){
        cell.thumbnailImageView.image = [UIImage imageNamed:@"cal.png"];
        
    }
    else if([[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"link_type"] isEqual: @"task"]){
        cell.thumbnailImageView.image = [UIImage imageNamed:@"task.png"];
    }
    else {
        cell.thumbnailImageView.image = [UIImage imageNamed:@"default.png"];
    }*/
    
    
    return cell;
}

- (void) tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    UIStoryboard *storyboard=self.storyboard;
    TaskDetailViewController *tdvc=[storyboard instantiateViewControllerWithIdentifier:@"TaskDetail"];
    tdvc.task_title_string=@"Title";
    [self presentViewController:tdvc animated:YES completion:nil];
                                    
    
    
}



@end
